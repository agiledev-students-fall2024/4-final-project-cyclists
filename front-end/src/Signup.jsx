import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaAngleDoubleLeft } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from './config/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', 
    email: '',
    password: ''
  });
  const [error, setError] = useState(''); // State to hold error message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error before submission
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, formData);
      console.log('Signup success:', response.data);
      navigate('/map'); // Redirect on success
    } catch (error) {
      if (error.response && error.response.status === 409) { 
        // Check for 409 Conflict status (username taken)
        setError('Username is already taken. Please choose a different one.');
      } else if (error.response && error.response.data && error.response.data.message) {
        // Handle other server-side validation errors
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      console.error('Signup failed:', error);
    }
  };

  return (
    <div className='relative flex h-94 items-center justify-center'>
      <div className='absolute left-4 top-4 cursor-pointer' onClick={() => navigate('/')}>
        <FaAngleDoubleLeft className='text-2xl text-emerald-800' />
      </div>
      <div className='rounded bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-2xl'>Sign Up</h2>

        {/* Display error message */}
        {error && <p className='mb-4 text-sm text-red-500'>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='username' className='block text-sm font-medium text-gray-700'>Username</label>
            <input
              type='text'
              id='username'
              value={formData.username}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border border-gray-300 p-2'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
            <input
              type='email'
              id='email'
              value={formData.email}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border border-gray-300 p-2'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
            <input
              type='password'
              id='password'
              value={formData.password}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border border-gray-300 p-2'
              required
            />
            <p className='mt-1 text-sm text-red-500'>Password must be at least 6 characters long.</p>
          </div>
          <button type='submit' className='rounded-md bg-emerald-800 px-4 py-2 text-white'>
            Sign Up
          </button>
        </form>
        <p className='mt-4'>
          Already have an account? <Link to='/login' className='text-emerald-800'>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
