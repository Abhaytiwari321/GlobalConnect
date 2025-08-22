// const mongoose = require('mongoose');

// const jobSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   company: {
//     type: String,
//     required: true,
//   },
//   companyLogo: {
//     type: String,
//     default: '',
//   },
//   location: {
//     type: String,
//     required: true,
//   },
//   type: {
//     type: String,
//     enum: ['full-time', 'part-time', 'contract', 'remote', 'internship'],
//     required: true,
//   },
//   experienceLevel: {
//     type: String,
//     enum: ['entry', 'mid', 'senior', 'executive'],
//     required: true,
//   },
//   salary: {
//     min: Number,
//     max: Number,
//     currency: {
//       type: String,
//       default: 'USD',
//     },
//     period: {
//       type: String,
//       enum: ['hourly', 'monthly', 'yearly'],
//       default: 'yearly',
//     },
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   requirements: [{
//     type: String,
//   }],
//   responsibilities: [{
//     type: String,
//   }],
//   benefits: [{
//     type: String,
//   }],
//   skills: [{
//     type: String,
//   }],
//   postedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   applicants: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     appliedAt: {
//       type: Date,
//       default: Date.now,
//     },
//     status: {
//       type: String,
//       enum: ['applied', 'reviewing', 'interviewed', 'accepted', 'rejected'],
//       default: 'applied',
//     },
//     coverLetter: String,
//     resume: String,
//   }],
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
//   expiresAt: {
//     type: Date,
//     default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
//   },
//   featured: {
//     type: Boolean,
//     default: false,
//   },
//   remote: {
//     type: Boolean,
//     default: false,
//   },
//   category: {
//     type: String,
//     enum: ['technology', 'marketing', 'sales', 'design', 'finance', 'hr', 'operations', 'other'],
//     default: 'other',
//   },
// }, { timestamps: true });

// // Virtual for applicant count
// jobSchema.virtual('applicantCount').get(function() {
//   return this.applicants.length;
// });

// // Index for search
// jobSchema.index({ title: 'text', company: 'text', description: 'text' });

// module.exports = mongoose.model('Job', jobSchema);

import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  companyLogo: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'remote', 'internship'],
    required: true,
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'executive'],
    required: true,
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD',
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly',
    },
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [{
    type: String,
  }],
  responsibilities: [{
    type: String,
  }],
  benefits: [{
    type: String,
  }],
  skills: [{
    type: String,
  }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applicants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['applied', 'reviewing', 'interviewed', 'accepted', 'rejected'],
      default: 'applied',
    },
    coverLetter: String,
    resume: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  },
  featured: {
    type: Boolean,
    default: false,
  },
  remote: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    enum: ['technology', 'marketing', 'sales', 'design', 'finance', 'hr', 'operations', 'other'],
    default: 'other',
  },
}, { timestamps: true });

// Virtual for applicant count
jobSchema.virtual('applicantCount').get(function () {
  return this.applicants.length;
});

// Index for search
jobSchema.index({ title: 'text', company: 'text', description: 'text' });

const Job = mongoose.model('Job', jobSchema);

export default Job;
