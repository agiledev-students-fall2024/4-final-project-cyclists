import mongoose from 'mongoose';

const IncidentSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: false, 
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
    duration: {  
      type: Number,
      required: true,
    },
    timestamp: { 
      type: Number,
      required: true,
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

const Incident = mongoose.model('Incident', IncidentSchema);

export default Incident;