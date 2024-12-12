import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaAngleDoubleLeft } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from './config/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: trimmedEmail,
        password: trimmedPassword
      });

      console.log('Login success:', response.data);
      
      // Store both token and user data
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.id); // Store user ID
        localStorage.setItem('user', JSON.stringify({ 
          username: response.data.username,
          id: response.data.id 
        }));
        console.log('User data saved to localStorage');
      }
      
      navigate('/map');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid email or password');
    }
  };

  return (
    <div className='relative flex h-screen items-center justify-center'>
      <div
        className='absolute left-4 top-4 cursor-pointer'
        onClick={() => navigate('/')}
      >
        <FaAngleDoubleLeft className='text-2xl text-emerald-800' />
      </div>
      <div className='rounded bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-2xl'>Login</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>} {/* Display error */}
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
            <input 
              type='email' 
              id='email' 
              value={formData.email} 
              onChange={handleChange} 
              className='m-1 block w-full rounded-md border border-gray-300 p-2' 
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
          <button 
            type='submit' 
            className='w-full rounded-md bg-emerald-800 px-4 py-2 text-white'>
            Login
          </button>
        </form>
        <p className='mt-4 text-center'>
          <Link to='/forgot-password' className='text-emerald-800'>Forgot Password?</Link>
        </p>
        <p className='mt-4 text-center'>
          Don't have an account? <Link to='/signup' className='text-emerald-800'>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
