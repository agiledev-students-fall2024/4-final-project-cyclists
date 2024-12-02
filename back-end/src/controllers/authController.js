import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const dataDir = path.join(path.resolve(), 'src/data');
const usersPath = path.join(dataDir, 'users.json');

// Ensure the data directory and users file exist
function ensureUsersFileExists() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
    if (!fs.existsSync(usersPath)) {
        fs.writeFileSync(usersPath, JSON.stringify([]), 'utf8');
        console.log("Initialized users.json with an empty array.");
    }
}

// Helper function to read users from the JSON file
function readUsers() {
    ensureUsersFileExists();
    const data = fs.readFileSync(usersPath, 'utf-8');
    return JSON.parse(data);
}

// Helper function to save users to the JSON file
function saveUsers(users) {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf8');
}

// Signup function
export const signup = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const users = readUsers();
    if (users.find(user => user.email === email)) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { name, email, password: hashedPassword };
    users.push(newUser);
    saveUsers(users);

    res.status(201).json({ message: 'User registered successfully' });
};

// Login function
export const login = (req, res) => {
    const { email, password } = req.body;

    const users = readUsers();
    const user = users.find(user => user.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', name: user.name });
};
