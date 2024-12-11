import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';  // Ensure the correct model path

// Signup function
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ error: 'Username, email, and password are required' });
  }

  try {
    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create a new user with username, email, and hashed password
    const newUser = new User({
      username,
      email,
      password,
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ error: 'An error occurred during password reset' });
  }
};

// Login functionality
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email credential' });
    }

    // Use bcrypt.compare with async/await to compare the passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password credential' });
    }

    // If passwords match, generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res
      .status(200)
      .json({ message: 'Login successful', token, username: user.username });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'An error occurred during login' });
  }
};

// Reset Password function
export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the password and save, triggering the pre-save hook
    user.password = password; // Plain text; will be hashed by the pre-save hook
    await user.save(); // This will hash the password

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ error: 'An error occurred during password reset' });
  }
};

// Forgot Password function
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User found' });
  } catch (err) {
    console.error('Error verifying user:', err);
    res.status(500).json({ error: 'An error occurred while verifying user' });
  }
};
