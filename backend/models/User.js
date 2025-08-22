// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const experienceSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   company: {
//     type: String,
//     required: true,
//   },
//   duration: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   current: {
//     type: Boolean,
//     default: false,
//   },
// }, { timestamps: true });

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6,
//   },
//   title: {
//     type: String,
//     default: '',
//   },
//   company: {
//     type: String,
//     default: '',
//   },
//   location: {
//     type: String,
//     default: '',
//   },
//   bio: {
//     type: String,
//     default: '',
//   },
//   avatar: {
//     type: String,
//     default: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
//   },
//   coverImage: {
//     type: String,
//     default: '',
//   },
//   skills: [{
//     type: String,
//   }],
//   experience: [experienceSchema],
//   connections: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'accepted', 'rejected'],
//       default: 'pending',
//     },
//     connectedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   }],
//   connectionRequests: [{
//     from: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     message: String,
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   }],
//   savedJobs: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Job',
//   }],
//   appliedJobs: [{
//     job: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Job',
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
//   }],
//   isVerified: {
//     type: Boolean,
//     default: false,
//   },
//   lastActive: {
//     type: Date,
//     default: Date.now,
//   },
// }, { timestamps: true });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // Compare password method
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// // Get connection count
// userSchema.virtual('connectionCount').get(function() {
//   return this.connections.filter(conn => conn.status === 'accepted').length;
// });

// module.exports = mongoose.model('User', userSchema);


import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  current: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  title: {
    type: String,
    default: '',
  },
  company: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  coverImage: {
    type: String,
    default: '',
  },
  skills: [{
    type: String,
  }],
  experience: [experienceSchema],
  connections: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    connectedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  connectionRequests: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  }],
  appliedJobs: [{
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
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
  }],
  isVerified: {
    type: Boolean,
    default: false,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get connection count
userSchema.virtual('connectionCount').get(function () {
  return this.connections.filter(conn => conn.status === 'accepted').length;
});

const User = mongoose.model('User', userSchema);

export default User;
