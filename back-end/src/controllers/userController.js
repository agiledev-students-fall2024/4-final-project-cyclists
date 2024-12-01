const profiles = {};

export const getProfile = async (req, res) => {
    const userId = req.params.userId;

    try {
        if (!profiles[userId]) {
            return res.status(404).send({ message: 'Profile not found' });
        }
        res.status(200).send(profiles[userId]);
    } catch (err) {
        res.status(500).send({ message: 'An error occurred while retrieving the profile' });
    }
};

export const saveProfile = async (req, res) => {
    const userId = req.params.userId;
    const profileData = req.body;

    if (!profileData.name || !profileData.email) {
        return res.status(400).send({ message: 'Missing required fields: name or email' });
    }

    try {
        profiles[userId] = profileData;
        res.status(200).send({ message: 'Profile saved successfully' });
    } catch (err) {
        res.status(500).send({ message: 'An error occurred while saving the profile' });
    }
};

export const getSavedRoutes = async (req, res) => {
    res.status(200).send({ message: 'Saved routes not implemented yet' });
};

export const addSavedRoute = async (req, res) => {
    res.status(200).send({ message: 'Add saved route not implemented yet' });
};

export const deleteSavedRoute = async (req, res) => {
    res.status(200).send({ message: 'Delete saved route not implemented yet' });
};
