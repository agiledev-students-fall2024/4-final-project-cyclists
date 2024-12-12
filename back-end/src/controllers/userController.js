import Route from '../models/Route.js';

const profiles = {};

/**
 * Retrieves user profile information.
 * @function getProfile
 * @param {Object} req - Request object with user ID.
 * @param {Object} res - Response object for sending the user profile.
 */
export const getProfile = async (req, res) => {
  const userId = req.params.userId;

  try {
    if (!profiles[userId]) {
      return res.status(404).send({ message: 'Profile not found' });
    }
    res.status(200).send(profiles[userId]);
  } catch (err) {
    res
      .status(500)
      .send({ message: 'An error occurred while retrieving the profile' });
  }
};

/**
 * Saves user profile data.
 * @function saveProfile
 * @param {Object} req - Request object with user ID and profile data.
 * @param {Object} res - Response object for sending confirmation.
 */
export const saveProfile = async (req, res) => {
  const userId = req.params.userId;
  const profileData = req.body;

  try {
    profiles[userId] = profileData; // Save profile in the mocked database
    res.status(200).send({ message: 'Profile saved successfully' });
  } catch (err) {
    res
      .status(500)
      .send({ message: 'An error occurred while saving the profile' });
  }
};

/**
 * Fetches saved routes for a user.
 * @function getSavedRoutes
 * @param {Object} req - Request object with user ID.
 * @param {Object} res - Response object for sending saved routes.
 */
export const getSavedRoutes = async (req, res) => {
  try {
    const userId = req.params.userId;
    const routes = await Route.find({ user: userId }).sort({ date: -1 });
    console.log('Found routes:', routes); // Debug log
    res.status(200).json(routes);
  } catch (error) {
    console.error('Error getting saved routes:', error);
    res.status(500).json({ error: 'Failed to retrieve routes' });
  }
};

/**
 * Adds a saved route for a user.
 * @function addSavedRoute
 * @param {Object} req - Request object with route data.
 * @param {Object} res - Response object for sending confirmation.
 */
export const addSavedRoute = async (req, res) => {
  try {
    const userId = req.params.userId;
    const routeData = req.body;
    
    const route = new Route({
      ...routeData,
      user: userId
    });
    
    const savedRoute = await route.save();
    res.status(201).json(savedRoute);
  } catch (error) {
    console.error('Error saving route:', error);
    res.status(500).json({ error: 'Failed to save route' });
  }
};

/**
 * Deletes a saved route for a user.
 * @function deleteSavedRoute
 * @param {Object} req - Request object with user ID and route ID.
 * @param {Object} res - Response object for sending confirmation.
 */
export const deleteSavedRoute = async (req, res) => {
  // Replace with implementation for deleting a saved route
  res.status(200).send({ message: 'Delete saved route not implemented yet' });
};
