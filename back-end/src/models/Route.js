import mongoose from 'mongoose';

const RouteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, 
    },
    username: { 
      type: String, 
      required: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    start_location: { 
      type: String, 
      required: true 
    },
    end_location: { 
      type: String, 
      required: true 
    },
    distance: { 
      type: Number, 
      required: true 
    },
    duration: { 
      type: Number, 
      required: true 
    },
    geometry: { 
      type: Object, 
      required: true 
    },
    steps: [
      { 
        type: Object 
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
      default: Date.now 
    },
  },
  {
    timestamps: true,
  }
);

const Route = mongoose.model('Route', RouteSchema);
export default Route;
