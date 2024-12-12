import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, MapPin, Clock, Route } from 'lucide-react';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { API_URL } from './config/api';

const Profile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: '',
    name: '',
    biography: '',
    gender: '',
    routes: []
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        // Fetch profile data
        const profileResponse = await fetch(`${API_URL}/users/${userId}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserInfo(prev => ({
            ...prev,
            ...profileData,
            username: profileData.username || localStorage.getItem('username')
          }));
        }

        // Fetch routes
        await fetchRoutes();
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/profile-routes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch routes');
      }

      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
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
          <div className='flex h-24 w-24 items-center justify-center rounded-lg bg-gradient-to-br from-orange-300 via-pink-400 to-purple-500'>
            <img 
              src="/default-profile.png" 
              alt="Profile"
              className='h-16 w-16 object-contain'
            />
          </div>
          <div className='flex-1'>
            <h2 className='text-lg font-medium'>{userInfo.username}</h2>
            {userInfo.name && <p className='text-gray-600'>{userInfo.name}</p>}
            {userInfo.biography && <p className='text-gray-600 mt-2'>{userInfo.biography}</p>}
            {userInfo.gender && userInfo.gender !== 'Select gender' && (
              <p className='text-gray-600 mt-1'>{userInfo.gender}</p>
            )}
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

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Routes</h2>
            <Link to="/saved-routes" className="text-emerald-600 hover:text-emerald-700">
              View All »
            </Link>
          </div>
          <div className="space-y-4">
            {routes.slice(0, 3).map((route) => (
              <div
                key={route._id}
                className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium">{route.name}</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <div>From: {route.start_location}</div>
                  <div>To: {route.end_location}</div>
                  <div className="mt-1">
                    Distance: {(route.distance / 1000).toFixed(2)} km • 
                    Duration: {Math.round(route.duration / 60)} min
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
