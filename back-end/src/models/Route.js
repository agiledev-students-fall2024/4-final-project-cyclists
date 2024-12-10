import mongoose from 'mongoose';

// TODO: update implementation after JWT is implemented
const RouteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Changed from true to false for now for the above reason
    },
    user: {
      type: String,
      required: true,
    },
    start_location: {
      type: String,
      required: true,
    },
    end_location: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    geometry: {
      type: Object,
      required: true,
    },
    steps: [
      {
        type: Object,
      },
    ],
    origin: {
      place_name: String,
      geometry: {
        type: { type: String },
        coordinates: [Number],
      },
    },
    destination: {
      place_name: String,
      geometry: {
        type: { type: String },
        coordinates: [Number],
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

const Route = mongoose.model('Route', RouteSchema);

export default Route;
