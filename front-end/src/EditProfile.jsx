import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config/api';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    biography: '',
    gender: 'Select gender'
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        const response = await fetch(`${API_URL}/users/${userId}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setFormData(prevData => ({
            ...prevData,
            name: data.name || '',
            username: data.username || '',
            biography: data.biography || '',
            gender: data.gender || 'Select gender'
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      console.log('Submitting profile data:', formData);
      console.log('User ID:', userId);

      const response = await fetch(`${API_URL}/users/${userId}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.message || 'Failed to save profile changes');
      }

      const data = await response.json();
      console.log('Save successful:', data);

      navigate('/profile');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile changes. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your name"
            />
          </div>

          {/* Username field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username:
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your username"
            />
          </div>

          {/* Biography field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biography:
            </label>
            <textarea
              name="biography"
              value={formData.biography}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="4"
              maxLength="200"
              placeholder="Enter your biography"
            />
            <div className="text-sm text-gray-500 mt-1">
              {200 - formData.biography.length} characters remaining
            </div>
          </div>

          {/* Gender selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender:
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Select gender">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Submit and Return buttons */}
          <div className="space-y-4">
            <button
              type="submit"
              className="w-full bg-emerald-800 text-white py-3 rounded-md hover:bg-emerald-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="w-full bg-gray-500 text-white py-3 rounded-md hover:bg-gray-600"
            >
              Return to Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
