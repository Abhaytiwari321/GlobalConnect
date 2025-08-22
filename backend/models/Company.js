// const mongoose = require('mongoose');

// const companySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   logo: {
//     type: String,
//     default: '',
//   },
//   coverImage: {
//     type: String,
//     default: '',
//   },
//   industry: {
//     type: String,
//     required: true,
//   },
//   size: {
//     type: String,
//     enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
//     required: true,
//   },
//   location: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   website: {
//     type: String,
//     default: '',
//   },
//   founded: {
//     type: Number,
//   },
//   specialties: [{
//     type: String,
//   }],
//   employees: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     role: {
//       type: String,
//       enum: ['admin', 'hr', 'employee'],
//       default: 'employee',
//     },
//     joinedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   }],
//   followers: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     followedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   }],
//   jobs: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Job',
//   }],
//   isVerified: {
//     type: Boolean,
//     default: false,
//   },
// }, { timestamps: true });

// // Virtual for employee count
// companySchema.virtual('employeeCount').get(function() {
//   return this.employees.length;
// });

// // Virtual for follower count
// companySchema.virtual('followerCount').get(function() {
//   return this.followers.length;
// });

// module.exports = mongoose.model('Company', companySchema);

import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  logo: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
    default: '',
  },
  industry: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    default: '',
  },
  founded: {
    type: Number,
  },
  specialties: [{
    type: String,
  }],
  employees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['admin', 'hr', 'employee'],
      default: 'employee',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  followers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    followedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  jobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  }],
  isVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Virtual for employee count
companySchema.virtual('employeeCount').get(function () {
  return this.employees.length;
});

// Virtual for follower count
companySchema.virtual('followerCount').get(function () {
  return this.followers.length;
});

const Company = mongoose.model('Company', companySchema);

export default Company;
