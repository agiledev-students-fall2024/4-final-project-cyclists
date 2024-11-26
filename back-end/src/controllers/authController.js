const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt'); // For hashing passwords
const usersPath = path.join(__dirname, '../data/users.json');

// Helper function to read users from the JSON file
function readUsers() {
    if (!fs.existsSync(usersPath)) {
        fs.writeFileSync(usersPath, JSON.stringify([]));
        console.log("users.json did not exist, creating an empty file.");
    }
    const data = fs.readFileSync(usersPath, 'utf-8');
    console.log("Users read from file:", data);  // Log users from the file
    return JSON.parse(data);
}

// Helper function to save users to the JSON file
function saveUsers(users) {
    console.log("Saving users to file:", users);  // Log the users before saving
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    console.log("Users saved successfully.");
}

// Signup function
exports.signup = (req, res) => {
    const { name, email, password } = req.body;

    // Log the received request body for debugging
    console.log("Received signup request body:", req.body);

    // Validate that all fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Read existing users
    const users = readUsers();

    // Check if user already exists
    const userExists = users.find(user => user.email === email);
    if (userExists) {
        console.log("User already exists:", email);
        return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Log the new user object
    const newUser = { name, email, password: hashedPassword };
    console.log("New user object to be saved:", newUser);

    // Add new user to the list with the 'name' field
    users.push(newUser);

    // Save updated users list
    saveUsers(users);

    res.status(201).json({ message: 'User registered successfully' });
};

// Login function
exports.login = (req, res) => {
    const { email, password } = req.body;

    // Log the received request body for debugging
    console.log("Received login request body:", req.body);

    // Read existing users
    const users = readUsers();

    // Find the user by email
    const user = users.find(user => user.email === email);
    if (!user) {
        console.log("User not found:", email);
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        console.log("Invalid password for user:", email);
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("Login successful for user:", email);
    res.status(200).json({ message: 'Login successful', name: user.name });
};
