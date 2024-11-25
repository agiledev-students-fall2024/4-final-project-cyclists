const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs'); 

const routeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    startLocation: {
      type: String,
      required: true
    },
    endLocation: {
      type: String,
      required: true
    },
    dateCreated: {
      type: Date,
      default: Date.now
    }
  });

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Ensure email is stored in lowercase
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please fill a valid email address'] // Email validation
    },
    password: {
      type: String,
      required: true,
      minlength: 6 // Minimum length of password
    },
    biography: {
      type: String,
      maxLength: 200
    },
    gender: {
      type: String,
      enum: ['Select gender', 'Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say']
    },
    savedRoutes: [routeSchema]
  }, {
    timestamps: true
  });
  
// Pre-save hook to hash the password before saving to the database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // If password is not modified, skip hashing
  
    try {
      const salt = await bcrypt.genSalt(10); 
      this.password = await bcrypt.hash(this.password, salt); // Hash password
      next();
    } catch (err) {
      next(err); // Pass any error to the next middleware
    }
  });
  
// Method to compare the entered password with the stored hashed password
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};
  
const User = mongoose.model('User', userSchema);
  
module.exports = { User }; // Use module.exports to export the User model
