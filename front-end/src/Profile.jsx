import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronRight, MapPin, Clock, Route } from 'lucide-react';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { API_URL } from './config/api';

const Profile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: 'unique_username',  // Default value if user is not found
    routes: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the current user's data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.username) {
      setUserInfo(prevInfo => ({ ...prevInfo, username: storedUser.username }));
    }

    const fetchRoutes = async () => {
      setIsLoading(true);
      try {
        // Retrieve token from local storage
        const token = localStorage.getItem('token');
    
        // Make an authorized request
        const response = await fetch(`${API_URL}/routes`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch routes');
        }
    
        const data = await response.json();
        // Sort routes by date (newest first) and take only the latest 5
        const sortedRoutes = data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
    
        setUserInfo((prevInfo) => ({ ...prevInfo, routes: sortedRoutes }));
        setError(null);
      } catch (error) {
        console.error('Error fetching routes:', error);
        setError('Failed to load routes');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const handleRouteClick = (route) => {
    localStorage.setItem('selectedRoute', JSON.stringify(route));
    navigate('/map');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className='min-h-screen bg-white'>
      <div className='px-4 pt-16 max-w-4xl mx-auto'>
        <div className='mb-8 flex items-start space-x-4'>
          <div className='flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100'>
            <User size={32} className='text-gray-400' />
          </div>
          <div className='flex-1'>
            <h2 className='text-lg font-medium'>{userInfo.username}</h2>  {/* Username displayed here */}
            <div className="mt-2 flex space-x-3">
              <button
                onClick={() => navigate('/edit-profile')}
                className='rounded-lg bg-emerald-800 px-4 py-2 text-sm text-white transition-colors hover:bg-emerald-700'
              >
                Edit Profile
              </button>
              <button
                onClick={() => navigate('/map')}
                className='rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white transition-colors hover:bg-emerald-500'
              >
                Create Route
              </button>
            </div>
          </div>
        </div>

        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-medium'>Recent Routes</h3>
          <div
            className='flex cursor-pointer items-center text-emerald-800 hover:text-emerald-600'
            onClick={() => navigate('/saved-routes')}
          >
            <span className='mr-1'>View All</span>
            <FaAngleDoubleRight />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className='mb-8 space-y-3'>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-800"></div>
            </div>
          ) : userInfo.routes.length > 0 ? (
            userInfo.routes.map((route) => (
              <div
                key={route.id}
                className='cursor-pointer rounded-lg bg-gray-50 p-4 hover:bg-gray-100 transition-colors border border-gray-100'
                onClick={() => handleRouteClick(route)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">{route.name}</h4>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="mr-2 text-emerald-600" />
                        {route.start_location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Route size={16} className="mr-2 text-emerald-700" />
                        {(route.distance / 1000).toFixed(2)} km
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-2 text-emerald-800" />
                        {Math.round(route.duration / 60)} min
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(route.date)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No routes saved yet</p>
              <button
                onClick={() => navigate('/map')}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-colors"
              >
                Create Your First Route
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
