<<<<<<< HEAD
import mongoose from 'mongoose';

const IncidentSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
            required: true,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
            },
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

IncidentSchema.index({ location: '2dsphere' });

export default mongoose.model('Incident', IncidentSchema);
=======
const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],  // [longitude, latitude]
            required: true
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

IncidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', IncidentSchema);
>>>>>>> e15422f8029015de1230b38f7426817dde5bc56a
