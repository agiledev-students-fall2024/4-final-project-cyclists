import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js'; // Ensure the correct model path

// Signup function
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ error: 'Username, email, and password are required' });
  }

  try {
    // Check if the user already exists by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('User already exists:', email);
      return res
        .status(409)
        .json({ error: 'User with this email or username already exists' });
    }

    // Create a new user with username, email, and hashed password
    const newUser = new User({
      username,
      email,
      password,
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token with user id, username, and email
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res
      .status(201)
      .json({
        message: 'User registered successfully',
        token,
        username: newUser.username,
      });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ error: 'An error occurred during password reset' });
  }
};

// Login functionality
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid email:', email);
      return res.status(401).json({ error: 'Invalid email credential' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password credential' });
    }

    // Generate JWT token with user id, username, and email
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
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

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

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

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

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
