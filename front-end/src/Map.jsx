import { useState, useRef, useEffect } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import { faTruckMedical} from '@fortawesome/free-solid-svg-icons';
import { FaArrowDown } from "react-icons/fa";

function Map() {
  const navigate = useNavigate();
  const mapContainerRef = useRef();
  const mapInstanceRef = useRef();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_API_KEY;

    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/en1135/cm2rtczub00dm01qi9phsddid', // style URL
      center: [-73.9967, 40.7312], // starting position [lng, lat]
      zoom: 13.5, // starting zoom
    });

    // Add Mapbox Geocoder (Search)
    mapInstanceRef.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        trackProximity: true,
        // Customize marker options
        marker: {
          color: 'red',
          draggable: true,
        },
        zoom: 14,
        placeholder: 'Search for places',
        // Customize flyTo animation options
        flyTo: {
          curve: 1,
          duration: 1000,
        },
      }),
      'top',
    );

    // Add Navigation control to map
    mapInstanceRef.current.addControl(
      new mapboxgl.NavigationControl(),
      'bottom-right',
    );

    // Add Mapbox Directions
    mapInstanceRef.current.addControl(
      new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/cycling',
        controls: {
          inputs: true,
          instructions: true,
          profileSwitcher: false,
        },
      }),
      'top',
    );

    mapInstanceRef.current.on('load', () => {
      setMapLoaded(true);
    });
  }, []);

  return (
    <div className="relative h-screen w-full pt-10">
      {/* Map container */}
      <div id="map-container" className="h-full w-full" ref={mapContainerRef} />

      <div className="absolute bottom-16 right-12 p-2 bg-white rounded-full shadow-lg cursor-pointer">
        <FaArrowDown className="text-2xl text-emerald-800" onClick={() => navigate('/saved-routes')}/>
      </div>
    </div>
  );
}
export default Map;
