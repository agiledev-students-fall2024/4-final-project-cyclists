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

// TODO: pull incident data from the back-end
// Mock JSON data
const mockData = [
  { id: 1, coordinates: [-73.998, 40.732], title: 'Pothole', minZoom: 18 },
  {
    id: 2,
    coordinates: [-73.999, 40.725],
    title: 'Blocked Bike Lane',
    minZoom: 18,
  },
  {
    id: 3,
    coordinates: [-73.999, 40.731],
    title: 'Aggressive Driver',
    minZoom: 18,
  },
  {
    id: 4,
    coordinates: [-73.983, 40.733],
    title: 'Road Construction',
    minZoom: 18,
  },
  {
    id: 5,
    coordinates: [-73.992, 40.722],
    title: 'Car Door Hazard',
    minZoom: 18,
  },
  {
    id: 6,
    coordinates: [-73.987, 40.738],
    title: 'Pedestrian in Bike Lane',
    minZoom: 18,
  },
  {
    id: 7,
    coordinates: [-73.996, 40.725],
    title: 'Unmarked Intersection',
    minZoom: 18,
  },
  {
    id: 8,
    coordinates: [-73.986, 40.732],
    title: 'Slippery Surface',
    minZoom: 18,
  },
  {
    id: 9,
    coordinates: [-73.976, 40.719],
    title: 'Obstructed View',
    minZoom: 18,
  },
];

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

      // Get the waypoints from the first leg; Not able to add from accessing geometry
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

  // Function to add pins to the map
  const loadMarkers = (map, pins) => {
    const markers = [];

    pins.forEach(location => {
      // TODO: customize pins based on type of incident
      // const el = document.createElement('div');
      // el.className = 'marker';
      // el.style.backgroundColor = '#5D7BD6';
      // el.style.width = '16px';
      // el.style.height = '16px';
      // el.style.borderRadius = '50%';
      // el.style.cursor = 'pointer';

      // el.addEventListener('click', () => {
      //   alert(`Clicked on: ${location.title}`);
      // });

      // const marker = new mapboxgl.Marker(el)
      // ...
      const marker = new mapboxgl.Marker()
        .setLngLat(location.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(location.title))
        .addTo(map);

      markers.push({ marker, minZoom: location.minZoom });
    });

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
        const selectedRoute = localStorage.getItem('selectedRoute');
        if (selectedRoute) {
          const route = JSON.parse(selectedRoute);
          loadSavedRoute(route);
          localStorage.removeItem('selectedRoute');
        }
      });

      const markers = loadMarkers(mapInstanceRef.current, mockData); // Add mock pins to the map

      // TODO: display pins based on zoom level, so that they don't clutter the map as a user zooms out
      // alternatively, we can add a toggle feature that hides pins when a user zooms out far enough

      // mapInstanceRef.current.on('zoom', () => {
      //   const zoom = mapInstanceRef.current.getZoom();
      //   markers.forEach(({ marker, minZoom }) => {
      //     if (zoom >= minZoom) {
      //       marker.remove();
      //     }
      //   });
      // });
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

          {/* Route info */}

          {/* {routeData && (
            <div className='absolute bottom-16 left-12 bg-white p-4 rounded shadow-lg max-w-md'>
              <h3 className='font-bold mb-2'>Route Information:</h3>
              <p>Distance: {(routeData.distance / 1000).toFixed(2)} km</p>
              <p>Duration: {Math.round(routeData.duration / 60)} minutes</p>
              <p className="mb-2">Steps: {routeData.legs[0].steps.length}</p> */}

          {/* Directions list */}
          {/* <div className="mt-4 max-h-48 overflow-y-auto">
                <h4 className="font-semibold mb-2">Turn-by-turn directions:</h4>
                <ol className="list-decimal list-inside space-y-2">
                  {routeData.legs[0].steps.map((step, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {step.maneuver.instruction}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )} */}
        </>
      )}
    </div>
  );
}

export default Map;
