import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';  // Ensure the correct model path

// Signup function
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  try {
    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with username, email, and hashed password
    const newUser = new User({
      username,
      email,
      password: hashedPassword,  // Store hashed password
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
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'An error occurred during signup' });
  }
};

// Login function
export const login = async (req, res) => {
  const { email, password } = req.body;
  
  // Trim email and password to remove any leading/trailing spaces
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();


  try {
    // Find the user by email
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      console.log('Invalid email credential')
      return res.status(401).json({ message: 'Invalid email credential' });
    }

    // Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(trimmedPassword, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password credential')
      return res.status(401).json({ message: 'Invalid password credential' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response with token and username
    res.status(200).json({ message: 'Login successful', token, username: user.username });
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
    //if (!user) {
      //return res.status(404).json({ message: 'User not found' });
    //}

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Save the updated user to the database
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: 'An error occurred during password reset' });
  }
};

// Forgot Password function
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

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
