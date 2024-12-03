import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
    savedRoutes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',  // Reference the Route model
    }],
}, {
    timestamps: true,  // Automatically add createdAt and updatedAt timestamps
});

// Pre-save hook to skip password hashing
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // If password is not modified, skip hashing
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        console.log('pre save password', this.password)
        next();
    } catch (err) {
        next(err); // Pass any error to the next middleware
    }
});

// Method to compare entered password with the stored password
userSchema.methods.comparePassword = async function (password) {
    return password === this.password; // Direct password comparison (no hashing)
};

// Create User model from the schema
const User = mongoose.model('User', userSchema);

export { User };
