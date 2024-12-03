import bcrypt from 'bcryptjs';
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
    // Check if the user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Generated password hash:', hashedPassword); // Debug log to check the hash

    // Create a new user with username, email, and hashed password
    const newUser = new User({
      username,
      email,
      password,  // Store hashed password
    });

    // Save the user to the database
    await newUser.save();
    console.log('New user created:', newUser);

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

// Login functionality 
export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log('Login Request:', { email });
  console.log('Entered password:', password); // Log entered password

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Invalid email credential:', email);
      return res.status(401).json({ message: 'Invalid email credential' });
    }

    console.log('Entered password:', password);
    console.log('Stored password (hashed):', user.password);

    // Use bcrypt.compare with async/await to compare the passwords
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log('Invalid password credential for user:', email);
      return res.status(401).json({ message: 'Invalid password credential' });
    }

    // If passwords match, generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('User logged in:', user.username);
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

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for reset:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the password and save, triggering the pre-save hook
    user.password = password;  // Plain text; will be hashed by the pre-save hook
    await user.save();  // This will hash the password

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