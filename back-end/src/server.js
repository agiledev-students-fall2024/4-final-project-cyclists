#!/usr/bin/env node

/**
 * @module server
 * @description Initializes and starts the web server.
 */

import dotenv from 'dotenv'; // import .env variables
import server from './app.js'; // load the web server

dotenv.config(); // load environment variables from .env

const port = process.env.PORT || 3001; // the port to listen to for incoming requests

/**
 * Starts the server and listens on the specified port.
 * @function
 * @returns {http.Server} The server instance.
 */
const listener = server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

/**
 * Stops the server from listening to the port.
 * @function
 * @returns {void}
 */
export const close = () => {
  listener.close();
};
