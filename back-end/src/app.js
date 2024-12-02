/**
 * @module app
 * @description Express application setup and route management.
 */

// Import required modules
import dotenv from 'dotenv'; // import .env variables
import express from 'express';
import morgan from 'morgan'; // middleware for logging HTTP requests
import mongoose from 'mongoose'; // mongoose models for MongoDB data manipulation

dotenv.config();

const app = express(); // instantiate an Express object

// Connect to the database
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
import authRoutes from './routes/auth.js'; // routes for authentication
import userRoutes from './routes/users.js'; // routes for user specific data
import incidentRoutes from './routes/incidents.js'; // routes for incidents
import routeRoutes from './routes/routes.js'; // routes for cycling routes
import profileRoutes from './routes/profile.js'; // routes for user profile

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/profiles', profileRoutes);

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
export default app;
