#!/usr/bin/env node

import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const port = process.env.PORT || 3001;

/**
 * Starts the server and listens on the specified port.
 * @function
 * @returns {http.Server} The server instance.
 */
const listener = app.listen(port, () => {
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
