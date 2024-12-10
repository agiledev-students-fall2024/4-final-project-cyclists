import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';  // Ensure the correct model path

// Signup function
export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Signup Request:', { username, email });  // Debug log

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  try {
    // Check if the user already exists by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(409).json({ message: 'User with this email or username already exists' });
    }

    // Create a new user with username, email, and hashed password
    const newUser = new User({
      username,
      email,
      password,
    });

    // Save the user to the database
    await newUser.save();
    console.log('New user created:', newUser);

    // Generate JWT token with user id, username, and email
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, email: newUser.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({ message: 'User registered successfully', token, username: newUser.username });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'An error occurred during signup' });
  }
};

// Login functionality 
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token with user id, username, and email
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(200).json({ message: 'Login successful', token, username: user.username });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'An error occurred during login' });
  }
};

// Reset Password function
export const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  console.log('Reset Password Request:', { email });  // Debug log

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for reset:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the password and save, triggering the pre-save hook to hash the password
    user.password = password;
    await user.save();

    console.log('Password updated for user:', email);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: 'An error occurred during password reset' });
  }
};

// Forgot Password function
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log('Forgot Password Request:', { email });  // Debug log

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found for forgot password:', email);
    res.status(200).json({ message: 'User found' });
  } catch (err) {
    console.error('Error verifying user:', err);
    res.status(500).json({ message: 'An error occurred while verifying user' });
  }
};

// Export the functions
export default {
  signup,
  login,
  resetPassword,
  forgotPassword,  // Export the forgotPassword function
};
