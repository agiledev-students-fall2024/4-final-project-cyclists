import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { X, MapPin } from 'lucide-react';
import Webcam from 'react-webcam';
import mapboxgl from 'mapbox-gl';
import EXIF from 'exif-js';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

function Post() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (showMap && mapContainerRef.current) {
      if (!MAPBOX_ACCESS_TOKEN) {
        console.error('Mapbox access token is missing');
        return;
      }

      if (!mapRef.current) {
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center:
            longitude && latitude
              ? [parseFloat(longitude), parseFloat(latitude)]
              : [-73.9967, 40.7312],
          zoom: 14,
          accessToken: MAPBOX_ACCESS_TOKEN,
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl());

        mapRef.current.on('click', e => {
          updateMapMarker(e.lngLat.lng, e.lngLat.lat);
        });
      }

      if (longitude && latitude) {
        const lng = parseFloat(longitude);
        const lat = parseFloat(latitude);

        if (markerRef.current) {
          markerRef.current.remove();
        }

        markerRef.current = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([lng, lat])
          .addTo(mapRef.current);

        mapRef.current.flyTo({
          center: [lng, lat],
          zoom: 14,
          essential: true,
        });
      }

      return () => {
        if (!showMap && mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
          setMapInitialized(false);
        }
      };
    }
  }, [showMap, longitude, latitude]);

  const updateMapMarker = (lng, lat) => {
    const lngStr = lng.toFixed(6);
    const latStr = lat.toFixed(6);

    setLongitude(lngStr);
    setLatitude(latStr);

    if (markerRef.current) {
      markerRef.current.remove();
    }

    markerRef.current = new mapboxgl.Marker({ color: 'red' })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 14,
    });
  };

  const extractImageMetadata = file => {
    return new Promise(resolve => {
      EXIF.getData(file, function () {
        console.log('EXIF data:', EXIF.getAllTags(this));

        const latitude = EXIF.getTag(this, 'GPSLatitude');
        const longitude = EXIF.getTag(this, 'GPSLongitude');
        const latRef = EXIF.getTag(this, 'GPSLatitudeRef');
        const longRef = EXIF.getTag(this, 'GPSLongitudeRef');

        console.log('Raw GPS data:', { latitude, longitude, latRef, longRef });

        if (latitude && longitude) {
          const latDecimal = convertDMSToDD(
            latitude[0],
            latitude[1],
            latitude[2],
            latRef,
          );
          const longDecimal = convertDMSToDD(
            longitude[0],
            longitude[1],
            longitude[2],
            longRef,
          );

          console.log('Converted coordinates:', { latDecimal, longDecimal });
          resolve({ longitude: longDecimal, latitude: latDecimal });
        } else {
          console.log('No GPS data found in image');
          resolve({ longitude: null, latitude: null });
        }
      });
    });
  };

  // Helper function to convert degrees, minutes, seconds to decimal degrees
  const convertDMSToDD = (degrees, minutes, seconds, direction) => {
    let dd = degrees + minutes / 60 + seconds / 3600;
    if (direction === 'S' || direction === 'W') {
      dd = dd * -1;
    }
    return dd;
  };

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (file) {
      // Set image preview
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);

      try {
        console.log('Processing file:', file.name);
        const { longitude: lng, latitude: lat } =
          await extractImageMetadata(file);
        console.log('Extracted coordinates:', { lng, lat });

        if (lng !== null && lat !== null) {
          console.log('Setting coordinates:', { lng, lat });
          setLongitude(lng.toFixed(6));
          setLatitude(lat.toFixed(6));
        } else {
          // If no GPS data, try to get current location as fallback
          try {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const currentLng = position.coords.longitude;
            const currentLat = position.coords.latitude;

            console.log('Using current location:', { currentLng, currentLat });
            setLongitude(currentLng.toFixed(6));
            setLatitude(currentLat.toFixed(6));
          } catch (locError) {
            console.log('Could not get current location:', locError);
          }
        }
        setShowMap(true);
      } catch (error) {
        console.error('Error processing image:', error);
        setShowMap(true);
      }
    }
  };

  const capture = async () => {
    try {
      const imageSrc = webcamRef.current.getScreenshot({
        width: 1440,
        height: 1080,
      });
      setImage(imageSrc);

      // Ask for location permission
      navigator.geolocation.getCurrentPosition(
        position => {
          const lng = position.coords.longitude;
          const lat = position.coords.latitude;
          setLongitude(lng.toFixed(6));
          setLatitude(lat.toFixed(6));
          setShowMap(true);
        },
        error => {
          console.log('Location permission denied or error:', error);
          if (error.code === 1) {
            alert(
              'Location permission denied. Please select location manually on the map.',
            );
          }
          setShowMap(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    } catch (error) {
      console.error('Error capturing photo:', error);
      alert('Error capturing photo. Please try again.');
    }
  };

  const handleImageClick = () => fileInputRef.current.click();

  const handleCaptionChange = e => setCaption(e.target.value);

  const handlePostClick = () => {
    console.log('Post clicked.', { caption, longitude, latitude, image });
    alert('Post submitted successfully!');
  };

  const invalidatePhoto = () => {
    setImage(null);
    setLongitude('');
    setLatitude('');
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className='mx-auto max-w-lg p-4'>
      <h1 className='mb-4 text-center text-2xl font-bold'>
        Report an Incident
      </h1>

      <div className='mb-4'>
        <div className='mb-2 flex items-center gap-2'>
          <MapPin className='h-5 w-5 text-gray-500' />
          <label className='text-gray-700'>Location:</label>
        </div>
        {longitude && latitude ? (
          <div
            className='cursor-pointer rounded border border-gray-200 bg-gray-50 p-3 hover:bg-gray-100'
            onClick={() => setShowMap(true)}
          >
            <p className='text-sm text-gray-600'>
              {`${latitude}, ${longitude}`}
            </p>
          </div>
        ) : (
          <></>
          // <button
          //   onClick={() => setShowMap(true)}
          //   className='w-full rounded border border-gray-200 bg-gray-50 p-3 text-left text-gray-600 hover:bg-gray-100'
          // >
          //   Click to set location
          // </button>
        )}
      </div>

      {showMap && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
          <div className='w-full max-w-2xl rounded-lg bg-white'>
            <div className='flex items-center justify-between border-b p-4'>
              <h2 className='text-lg font-semibold'>
                Confirm Location{' '}
                {longitude && latitude ? `(${latitude}, ${longitude})` : ''}
              </h2>
              <button
                onClick={() => setShowMap(false)}
                className='rounded p-1 hover:bg-gray-100'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
            <div className='h-96'>
              <div ref={mapContainerRef} className='h-full w-full' />
            </div>
            <div className='flex justify-end gap-2 border-t p-4'>
              <button
                onClick={() => {
                  setShowMap(false);
                  setLongitude('');
                  setLatitude('');
                }}
                className='rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400'
              >
                Clear Location
              </button>
              <button
                onClick={() => setShowMap(false)}
                className='rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600'
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='mb-4 flex aspect-[4/3] w-full items-center justify-center rounded bg-gray-200'>
        {image ? (
          <img
            className='h-full w-full rounded object-cover'
            src={image}
            alt='Captured or Uploaded'
          />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat='image/jpeg'
            className='h-full w-full rounded'
          />
        )}
      </div>

      {image ? (
        <button
          className='mb-4 w-full rounded bg-gray-500 py-2 font-semibold text-white hover:bg-gray-700'
          onClick={invalidatePhoto}
        >
          Clear Photo
        </button>
      ) : (
        <button
          className='mb-4 w-full rounded bg-gray-500 py-2 font-semibold text-white hover:bg-gray-700'
          onClick={capture}
        >
          Capture Photo
        </button>
      )}

      <div className='image-uploader'>
        <button
          className='mb-4 w-full rounded bg-gray-500 py-2 font-semibold text-white hover:bg-gray-700'
          onClick={handleImageClick}
        >
          Upload Photo
        </button>

        <input
          type='file'
          accept='image/*'
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </div>

      <textarea
        className='mb-4 w-full resize-none rounded border border-gray-300 p-2 align-top'
        rows='3'
        placeholder='Write a caption ...'
        value={caption}
        onChange={handleCaptionChange}
      />

      <button
        className='w-full rounded bg-gray-500 py-2 font-semibold text-white hover:bg-gray-700 hover:transition-all'
        onClick={handlePostClick}
      >
        Post
      </button>
    </div>
  );
}

export default Post;
