// Import required modules
require('dotenv').config(); // import .env variables
const express = require('express');
const morgan = require('morgan'); // middleware for logging HTTP requests
const mongoose = require('mongoose'); // mongoose models for MongoDB data manipulation

/**
 * @module app
 * @description Express application setup and route management.
 */

const app = express(); // instantiate an Express object

// connect to the database
try {
  mongoose.connect(process.env.MONGODB_URI);
  console.log(`Connected to MongoDB.`);
} catch (err) {
  console.log(
    `Error connecting to MongoDB user account authentication will fail: ${err}`
  );
}

app.use((req, res, next) => {
  // Allow requests from your React app
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Use Middleware
app.use(morgan('dev')); // dev style gives a concise color-coded style of log output
app.use(express.json({ limit: '50mb' })); // middleware to parse JSON requests
app.use(express.urlencoded({ extended: true }));

// Import Routes
const authRoutes = require('./routes/auth.js'); // routes for authentication
const userRoutes = require('./routes/users'); // routes for user specific data
const incidentRoutes = require('./routes/incidents'); // routes for incidents
const routeRoutes = require('./routes/routes'); // routes for cycling routes

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/routes', routeRoutes);

// Route that triggers an internal error (500)
app.get('/error-route', (req, res, next) => {
  const error = new Error();
  next(error); // pass the error to the error handling middleware
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

/**
 * Route for HTTP GET requests to the root document.
 * @function
 * @name getRoot
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get('/', (req, res) => {
  res.send('Goodbye world!');
});

// export the express app we created to make it available to other modules
module.exports = app;
