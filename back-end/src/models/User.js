import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define route schema for user
const routeSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    startLocation: {
        type: String,
        required: true,
    },
    endLocation: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

// Define user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,  // Optional: Add minimum length validation for username
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Ensure email is stored in lowercase
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please provide a valid email address',
        ], // Email validation regex
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum length of password
    },
    biography: {
        type: String,
        maxLength: 200,  // Optional: Max length for biography text
    },
    gender: {
        type: String,
        enum: [
            'Select gender',
            'Male',
            'Female',
            'Non-binary',
            'Other',
            'Prefer not to say',
        ],
    },
    savedRoutes: [routeSchema],  // Embedding route schema within user
}, {
    timestamps: true,  // Automatically add createdAt and updatedAt timestamps
});

// Pre-save hook to skip password hashing
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Skip if password is not modified
    next(); // No hashing done here
});

// Method to compare entered password with the stored password
userSchema.methods.comparePassword = async function (password) {
    return password === this.password; // Direct password comparison (no hashing)
};

// Create User model from the schema
const User = mongoose.model('User', userSchema);

export { User };
