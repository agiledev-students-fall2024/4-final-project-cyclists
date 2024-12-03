import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  location: {
    type: String,
  },
}, {
  timestamps: true,
});

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile;
