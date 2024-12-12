import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaAngleDoubleLeft } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from './config/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',  // Changed from 'name' to 'username'
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, formData);
      console.log('Signup success:', response.data);

      // Check if token exists in the response
      const { token, username } = response.data;

      if (!token) {
        console.error('No token received from server'); // Log for debugging
        throw new Error('No token received from server');
      }

      // Save the token and user info in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username }));

      console.log(
        'Token saved to localStorage:',
        localStorage.getItem('token'),
      ); // 🔥 Verify token is stored
      console.log('User saved to localStorage:', localStorage.getItem('user')); // 🔥 Verify user is stored

      navigate('/map'); // Redirect on success
    } catch (error) {
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
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='username' className='block text-sm font-medium text-gray-700'>Username</label>
            <input
              type='text'
              id='username'  // Changed 'name' to 'username'
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
