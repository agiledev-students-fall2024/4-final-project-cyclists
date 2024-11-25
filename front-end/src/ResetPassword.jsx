import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error sending reset link.');
    }
  };

  return (
    <div className='p-6 shadow-md rounded'>
      <h2 className='text-2xl mb-4'>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='Enter your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='w-full border rounded p-2'
        />
        <button type='submit' className='bg-emerald-800 text-white px-4 py-2 mt-2 rounded'>Submit</button>
      </form>
      {message && <p className='mt-4'>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
