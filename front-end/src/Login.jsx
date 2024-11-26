import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaAngleDoubleLeft } from 'react-icons/fa';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.API_URL}/auth/login`, formData);
      console.log('Login success:', response.data);
      navigate('/map'); // Redirect on success
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className='relative flex h-94 items-center justify-center'>
      <div
        className='absolute left-4 top-4 cursor-pointer'
        onClick={() => navigate('/')}
      >
        <FaAngleDoubleLeft className='text-2xl text-emerald-800' />
      </div>
      <div className='rounded bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-2xl'>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
            <input type='email' id='email' value={formData.email} onChange={handleChange} className='mt-1 block w-full rounded-md border border-gray-300 p-2' required />
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
            <input type='password' id='password' value={formData.password} onChange={handleChange} className='mt-1 block w-full rounded-md border border-gray-300 p-2' required />
          </div>
          <button type='submit' className='rounded-md bg-emerald-800 px-4 py-2 text-white'>Login</button>
        </form>
        <p className='mt-4'>Don't have an account? <Link to='/signup' className='text-emerald-800'>Sign up</Link></p>
      </div>
    </div>
  );
};

export default Login;
