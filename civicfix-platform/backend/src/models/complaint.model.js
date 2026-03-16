const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaint_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone_number: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      default: null,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    // GeoJSON Point for geospatial queries
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
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Reported', 'Under Review', 'In Progress', 'Resolved'],
      default: 'Reported',
      index: true,
    },
    assigned_worker_id: {
      type: String,
      default: null,
    },
    resolution_image_url: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// 2dsphere index for geospatial duplicate detection and map queries
complaintSchema.index({ location: '2dsphere' });
complaintSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
