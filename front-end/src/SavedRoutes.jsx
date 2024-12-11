import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMapMarkerAlt, FaRoute, FaClock, FaRuler } from 'react-icons/fa';
import { API_URL } from './config/api';

const SavedRoutes = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/routes`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in request
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch routes');
      }

      const data = await response.json();
      setRoutes(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setError('Failed to load routes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRouteClick = async (routeId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/routes/${routeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch route details');
      }

      const fullRoute = await response.json();
      localStorage.setItem('selectedRoute', JSON.stringify(fullRoute)); // Store selected route details
      navigate('/map');
    } catch (error) {
      console.error('Error loading route details:', error);
      setError('Failed to load route details.');
    }
  };

  const deleteRoute = async (routeId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/routes/${routeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete route');
      }

      setRoutes(routes.filter((route) => route._id !== routeId));
    } catch (error) {
      console.error('Error deleting route:', error);
      setError('Failed to delete route.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 pt-16 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Saved Routes</h1>
          <button
            onClick={() => navigate('/map')}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors"
          >
            Create New Route
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {routes.length > 0 ? (
            routes.map((route) => (
              <div
                key={route._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 hover:border-emerald-200 transition-all"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleRouteClick(route._id)}
                    >
                      {/* Route Name */}
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {route.name || 'Unnamed Route'}
                      </h3>

                      {/* Locations */}
                      <div className="space-y-1 mb-3">
                        <div className="text-sm text-gray-600 flex items-center">
                          <FaMapMarkerAlt className="text-emerald-600 mr-2" />
                          <span className="font-medium">From:</span>
                          <span className="ml-2">{route.start_location}</span>
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <FaMapMarkerAlt className="text-emerald-800 mr-2" />
                          <span className="font-medium">To:</span>
                          <span className="ml-2">{route.end_location}</span>
                        </div>
                      </div>

                      {/* Route Stats */}
                      <div className="grid grid-cols-3 gap-4 mt-3 pb-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaRuler className="mr-2" />
                          {(route.distance / 1000).toFixed(2)} km
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaClock className="mr-2" />
                          {Math.round(route.duration / 60)} min
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaRoute className="mr-2" />
                          {route.steps?.length || 0} steps
                        </div>
                      </div>

                      {/* Date */}
                      <div className="text-xs text-gray-400 mt-2">
                        Saved on: {new Date(route.date).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRoute(route._id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete route"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {/* View Route Button */}
                <div
                  className="bg-gray-50 px-4 py-3 text-sm cursor-pointer hover:bg-emerald-50 transition-colors"
                  onClick={() => handleRouteClick(route._id)}
                >
                  <span className="text-emerald-600 font-medium">View and Navigate Route →</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No routes saved yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first route to see it here!
              </p>
              <button
                onClick={() => navigate('/map')}
                className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-colors"
              >
                Create Route
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedRoutes;

