import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import incidentRoutes from './routes/incidents.js';
import routeRoutes from './routes/routes.js';
import profileRoutes from './routes/profile.js';

dotenv.config();

const app = express(); // Ensure app is initialized first

// Connect to the database
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'Cyclists', // Replace with your database name
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB.'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/profiles', profileRoutes);

app.get('/error-route', (req, res, next) => {
  const error = new Error('Test error');
  next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  const errorMessage = err.message || 'Internal Server Error';
  res.status(err.status || 500).json({ error: errorMessage });
});


// Basic route
app.get('/', (req, res) => {
  res.send('Goodbye world!');
});

export default app;
