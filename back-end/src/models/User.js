import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please provide a valid email address',
        ],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    biography: {
        type: String,
        maxLength: 200,
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
        ref: 'Route',
    }],
}, {
    timestamps: true,
});

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare entered password with stored hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw new Error('Error comparing passwords');
    }
};

const User = mongoose.model('User', userSchema);

export { User };