import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import { FaSave } from 'react-icons/fa';
import { FaExclamationTriangle } from 'react-icons/fa';
import { API_URL } from './config/api';

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;


function Map() {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const directionsRef = useRef(null);
  const [routeData, setRouteData] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [isLoadingSavedRoute, setIsLoadingSavedRoute] = useState(false);
  const [incidents, setIncidents] = useState([]);

  const reportIncident = () => {
    navigate('/post');
  };

  const saveRoute = async () => {
    if (!routeData) {
      setSaveStatus('No route to save');
      return;
    }

    try {
      setIsSaving(true);

      // Debug logging
      console.log('Route Data:', routeData);

      if (!routeData.legs || !routeData.legs[0]) {
        setSaveStatus('Invalid route data - no route legs found');
        return;
      }

      // Get the waypoints from the first leg
      const startPoint = routeData.legs[0].steps[0];
      const endPoint =
        routeData.legs[0].steps[routeData.legs[0].steps.length - 1];

      // Create route object for storage with validated data
      const newRoute = {
        name: `${startPoint.name || 'Start'} to ${endPoint.name || 'End'}`,
        start_location: startPoint.name || 'Start',
        end_location: endPoint.name || 'End',
        distance: routeData.distance || 0,
        duration: routeData.duration || 0,
        geometry: routeData.geometry || null,
        steps: routeData.legs[0].steps || [],
        origin: {
          place_name: startPoint.name || 'Start',
          geometry: {
            type: 'Point',
            coordinates: [
              startPoint.maneuver.location[0],
              startPoint.maneuver.location[1],
            ],
          },
        },
        destination: {
          place_name: endPoint.name || 'End',
          geometry: {
            type: 'Point',
            coordinates: [
              endPoint.maneuver.location[0],
              endPoint.maneuver.location[1],
            ],
          },
        },
      };

      // Debug logging
      console.log('Attempting to save route:', newRoute);

      // Make the API request
      const response = await fetch(`${API_URL}/routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoute),
      });

      // Log response status for debugging
      console.log('Response status:', response.status);

      // Handle non-ok responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.message || 'Failed to save route',
        );
      }

      const savedRoute = await response.json();
      console.log('Route saved successfully:', savedRoute);

      setSaveStatus('Route saved successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving route:', error);
      setSaveStatus(`Error saving route: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const loadSavedRoute = async route => {
    try {
      setIsLoadingSavedRoute(true);

      if (directionsRef.current) {
        // Set origin and destination using the coordinates from the saved route
        directionsRef.current.setOrigin(route.origin.geometry.coordinates);
        directionsRef.current.setDestination(
          route.destination.geometry.coordinates,
        );

        // Fit the map to show the full route
        if (mapInstanceRef.current && route.geometry) {
          const bounds = new mapboxgl.LngLatBounds();

          // Add origin and destination to bounds
          bounds.extend(route.origin.geometry.coordinates);
          bounds.extend(route.destination.geometry.coordinates);

          // Add all step locations to bounds
          if (route.steps) {
            route.steps.forEach(step => {
              if (step.maneuver && step.maneuver.location) {
                bounds.extend(step.maneuver.location);
              }
            });
          }

          mapInstanceRef.current.fitBounds(bounds, {
            padding: 100,
            duration: 1000,
          });
        }
      }
    } catch (error) {
      console.error('Error loading saved route:', error);
      setMapError('Error loading saved route');
    } finally {
      setIsLoadingSavedRoute(false);
    }
  };

  const fetchIncidents = async () => {
  try {
    const response = await fetch(`${API_URL}/incidents`);
    if (!response.ok) {
      throw new Error('Failed to fetch incidents');
    }
    const data = await response.json();
    
    // Transform the data to match the marker format
    const transformedData = data.map(incident => ({
      id: incident._id,
      coordinates: incident.location.coordinates,
      title: incident.caption,
      duration: incident.duration,
      timestamp: incident.timestamp
    }));

    setIncidents(transformedData);
  } catch (error) {
    console.error('Error fetching incidents:', error);
  }
};

  // Function to add pins to the map with duration handling
  const loadMarkers = (map, pins) => {
  const markers = [];

  const filterAndUpdateMarkers = () => {
    const currentTime = Date.now();
    markers.forEach(({ marker, timestamp, duration }) => {
      if (currentTime - timestamp > duration) {
        marker.remove();
      }
    });
  };

  pins.forEach(incident => {
    const currentTime = Date.now();
    const markerAge = currentTime - incident.timestamp;

    if (markerAge <= incident.duration) {
      const marker = new mapboxgl.Marker()
        .setLngLat(incident.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div>
              <h3>${incident.title}</h3>
              <p>Reported: ${new Date(incident.timestamp).toLocaleTimeString()}</p>
              <p>Active for: ${incident.duration / 60000} minutes</p>
              <p>Expires in: ${Math.round((incident.duration - markerAge) / 60000)} minutes</p>
            </div>
          `)
        )
        .addTo(map);

      markers.push({
        marker,
        timestamp: incident.timestamp,
        duration: incident.duration
      });
    }
  });

  setInterval(filterAndUpdateMarkers, 60000);
  return markers;
};

  useEffect(() => {
    if (!MAPBOX_ACCESS_TOKEN) {
      setMapError('Mapbox access token is missing');
      return;
    }

    try {
      mapInstanceRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/en1135/cm2rtczub00dm01qi9phsddid', // style URL
        center: [-73.9967, 40.7312],
        zoom: 13.5,
      });

      mapInstanceRef.current.addControl(
        new mapboxgl.NavigationControl(),
        'bottom-right',
      );

      directionsRef.current = new MapboxDirections({
        accessToken: MAPBOX_ACCESS_TOKEN,
        unit: 'metric',
        profile: 'mapbox/cycling',
        alternatives: true,
        controls: {
          inputs: true,
          instructions: true,
          profileSwitcher: false,
        },
        interactive: true,
      });

      mapInstanceRef.current.addControl(directionsRef.current, 'top-left');

      // Listen for route updates
      directionsRef.current.on('route', e => {
        if (e.route && e.route[0]) {
          setRouteData(e.route[0]);
          setSaveStatus('');
          console.log('New route data:', e.route[0]);
        }
      });

      mapInstanceRef.current.on('error', e => {
        console.error('Map error:', e);
        setMapError('Error loading map');
      });

      // Load saved route if available
          mapInstanceRef.current.on('load', () => {
      // Load saved route if exists
      const selectedRoute = localStorage.getItem('selectedRoute');
      if (selectedRoute) {
        const route = JSON.parse(selectedRoute);
        loadSavedRoute(route);
        localStorage.removeItem('selectedRoute');
      }

      // Initial fetch of incidents
      fetchIncidents();
      
      // Set up periodic fetching (every minute)
      const fetchInterval = setInterval(fetchIncidents, 60000);

      // Load markers with real incident data
      const markers = loadMarkers(mapInstanceRef.current, incidents);

      // Cleanup interval on unmount
      return () => {
        clearInterval(fetchInterval);
      };
    });
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Error initializing map');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
  if (mapInstanceRef.current) {
    loadMarkers(mapInstanceRef.current, incidents);
  }
}, [incidents]);

  return (
    <div className='relative h-screen'>
      {mapError ? (
        <div className='flex h-full items-center justify-center bg-gray-100'>
          <div className='p-4 text-center text-red-600'>
            <p className='text-xl font-bold'>Error</p>
            <p>{mapError}</p>
            <p className='mt-2 text-sm'>
              Please check your Mapbox configuration
            </p>
          </div>
        </div>
      ) : (
        <>
          <div
            id='map-container'
            className='h-94 w-full'
            ref={mapContainerRef}
          />

          {/* Controls */}
          {/* <div className='absolute top-4 right-12 bg-white p-4 rounded shadow-lg space-y-2'> */}
          <div className='absolute bottom-16 left-12 max-w-md space-y-2 rounded bg-white p-4 shadow-lg'>
            {routeData && (
              <button
                onClick={saveRoute}
                disabled={isSaving || isLoadingSavedRoute}
                className={`w-full ${
                  isSaving || isLoadingSavedRoute
                    ? 'bg-gray-400'
                    : 'bg-green-500 hover:bg-green-600'
                } flex items-center justify-center gap-2 rounded px-4 py-2 text-white`}
              >
                <FaSave />
                {isSaving ? 'Saving...' : 'Save Route'}
              </button>
            )}
            {saveStatus && (
              <div
                className={`rounded p-2 text-center ${
                  saveStatus.includes('Error')
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600'
                }`}
              >
                {saveStatus}
              </div>
            )}
          </div>

          <div className='absolute bottom-16 right-12 rounded bg-white p-4 shadow-lg'>
            <button
              onClick={reportIncident}
              className='flex items-center justify-center gap-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600'
            >
              <FaExclamationTriangle />
              Report Incident
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Map;
