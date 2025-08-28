// // D:\JobseekerWeb\backend\models\Job.js



const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true, 
  },
  companyLogo: {
    type: String,
    trim: true,
    default: '',
  },
  experience: {
    type: String,
    required: [true, 'Experience is required'],
    trim: true,
  },
  salary: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  openings: {
    type: Number,
    required: [true, 'Number of openings is required'],
    min: [1, 'At least one opening is required'],
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected'],
      message: 'Status must be pending, approved, or rejected',
    },
    default: 'approved', // Default to approved for admin-created jobs
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Posted by is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for performance
jobSchema.index({ postedBy: 1 });
jobSchema.index({ status: 1 });

module.exports = mongoose.model('Job', jobSchema);