const { User } = require('../models/User'); 
const bcrypt = require('bcrypt');

// Signup function
exports.signup = async (req, res) => {
    const { email, password, username, name } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({
            username,
            name,
            email,
            password, // Password will be hashed automatically by the pre-save middleware
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({ message: 'An error occurred during signup' });
    }
};

// Login function
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the entered password with the stored hashed password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'An error occurred during login' });
    }
};
