import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();
  const selectedRoute = location.state?.route;
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

      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in localStorage');
        setSaveStatus('Error: User not authenticated');
        navigate('/login');
        return;
      }

      console.log('Token being sent:', token);
      console.log('Route data being sent:', routeData);

      if (!routeData.legs || !routeData.legs[0]) {
        setSaveStatus('Invalid route data - no route legs found');
        return;
      }

      const startPoint = routeData.legs[0].steps[0];
      const endPoint = routeData.legs[0].steps[routeData.legs[0].steps.length - 1];

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
            coordinates: startPoint.maneuver.location,
          },
        },
        destination: {
          place_name: endPoint.name || 'End',
          geometry: {
            type: 'Point',
            coordinates: endPoint.maneuver.location,
          },
        },
      };

      const response = await fetch(`${API_URL}/routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newRoute),
      });

      console.log('Response status:', response.status);

      if (response.status === 401) {
        console.warn('Token expired or user is not authenticated');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || errorData.message || 'Failed to save route');
      }

      const savedRoute = await response.json();
      console.log('Route saved successfully:', savedRoute);
      setSaveStatus('Route saved successfully!');

      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving route:', error);
      setSaveStatus(`Error saving route: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!MAPBOX_ACCESS_TOKEN) {
      setMapError('Mapbox access token is missing');
      return;
    }

    try {
      mapInstanceRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/en1135/cm2rtczub00dm01qi9phsddid',
        center: [-73.9967, 40.7312],
        zoom: 13.5,
      });

      mapInstanceRef.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

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
    if (selectedRoute && directionsRef.current) {
      directionsRef.current.setOrigin(selectedRoute.origin.geometry.coordinates);
      directionsRef.current.setDestination(selectedRoute.destination.geometry.coordinates);
    }
  }, [selectedRoute]);

  return (
    <div className='relative h-screen'>
      {mapError ? (
        <div className='flex h-full items-center justify-center bg-gray-100'>
          <div className='p-4 text-center text-red-600'>
            <p className='text-xl font-bold'>Error</p>
            <p>{mapError}</p>
            <p className='mt-2 text-sm'>Please check your Mapbox configuration</p>
          </div>
        </div>
      ) : (
        <>
          <div id='map-container' className='h-94 w-full' ref={mapContainerRef} />

          <div className='absolute bottom-16 left-12 max-w-md space-y-2 rounded bg-white p-4 shadow-lg'>
            {routeData && (
              <button
                onClick={saveRoute}
                disabled={isSaving || isLoadingSavedRoute}
                className={`w-full ${
                  isSaving || isLoadingSavedRoute ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                } flex items-center justify-center gap-2 rounded px-4 py-2 text-white`}
              >
                <FaSave />
                {isSaving ? 'Saving...' : 'Save Route'}
              </button>
            )}
            {saveStatus && (
              <div className={`rounded p-2 text-center ${
                saveStatus.includes('Error') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}>
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
