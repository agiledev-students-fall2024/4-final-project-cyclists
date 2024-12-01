import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords don't match!");
      return;
    }

    try {
      // Call the backend API to update the password without a token
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password`, { password });
      setMessage('Password updated successfully!');
      // Redirect to login page after reset
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage('Error resetting password.');
    }
  };

  return (
    <div className='p-6 shadow-md rounded'>
      <h2 className='text-2xl mb-4'>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='password'
          placeholder='New password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='w-full border rounded p-2 mb-2'
        />
        <input
          type='password'
          placeholder='Confirm password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className='w-full border rounded p-2'
        />
        <button type='submit' className='bg-emerald-800 text-white px-4 py-2 mt-2 rounded'>Reset</button>
      </form>
      {message && <p className='mt-4'>{message}</p>}
    </div>
  );
};

export default ResetPassword;

