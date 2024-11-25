#!/usr/bin/env node

/**
 * @module server
 * @description Initializes and starts the web server.
 */

require('dotenv').config(); // Load environment variables from .env
const mongoose = require('mongoose'); // Import Mongoose for MongoDB
const server = require('./app'); // Load the web server

const port = process.env.PORT || 3001; // The port to listen to for incoming requests

/**
 * Connect to MongoDB and start the server.
 */
async function startServer() {
  try {
    // Establish MongoDB connection
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Start the server
    const listener = server.listen(port, function () {
      console.log(`Server running on port: ${port}`);
    });

    /**
     * Stops the server from listening to the port.
     * @function
     * @returns {void}
     */
    const close = () => {
      listener.close();
      mongoose.disconnect(); // Disconnect from MongoDB when the server closes
    };

    module.exports = {
      close: close,
    };
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process with an error code if the connection fails
  }
}

startServer();
