// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const auth = require('../middleware/auth');
// const { upload } = require('../config/cloudinary');

// const router = express.Router();

// // Generate JWT Token
// const generateToken = (userId) => {
//   return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
// };

// // @route   POST /api/auth/register
// // @desc    Register user
// // @access  Public
// router.post('/register', async (req, res) => {
//   try {
//     const { name, email, password, title, company, location } = req.body;

//     // Check if user exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create user
//     user = new User({
//       name,
//       email,
//       password,
//       title: title || '',
//       company: company || '',
//       location: location || '',
//     });

//     await user.save();

//     // Generate token
//     const token = generateToken(user._id);

//     res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         title: user.title,
//         company: user.company,
//         location: user.location,
//         avatar: user.avatar,
//         bio: user.bio,
//         skills: user.skills,
//         experience: user.experience,
//         connections: user.connectionCount,
//       },
//     });
//   } catch (error) {
//     console.error('Register error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/auth/login
// // @desc    Login user
// // @access  Public
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Check password
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Update last active
//     user.lastActive = new Date();
//     await user.save();

//     // Generate token
//     const token = generateToken(user._id);

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         title: user.title,
//         company: user.company,
//         location: user.location,
//         avatar: user.avatar,
//         bio: user.bio,
//         skills: user.skills,
//         experience: user.experience,
//         connections: user.connectionCount,
//       },
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   GET /api/auth/me
// // @desc    Get current user
// // @access  Private
// router.get('/me', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-password');
//     res.json({
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       title: user.title,
//       company: user.company,
//       location: user.location,
//       avatar: user.avatar,
//       bio: user.bio,
//       skills: user.skills,
//       experience: user.experience,
//       connections: user.connectionCount,
//     });
//   } catch (error) {
//     console.error('Get user error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   PUT /api/auth/profile
// // @desc    Update user profile
// // @access  Private
// router.put('/profile', auth, upload.single('avatar'), async (req, res) => {
//   try {
//     const { name, title, company, location, bio, skills } = req.body;
    
//     const updateData = {
//       name,
//       title,
//       company,
//       location,
//       bio,
//       skills: skills ? JSON.parse(skills) : [],
//     };

//     if (req.file) {
//       updateData.avatar = req.file.path;
//     }

//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       updateData,
//       { new: true }
//     ).select('-password');

//     res.json({
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       title: user.title,
//       company: user.company,
//       location: user.location,
//       avatar: user.avatar,
//       bio: user.bio,
//       skills: user.skills,
//       experience: user.experience,
//       connections: user.connectionCount,
//     });
//   } catch (error) {
//     console.error('Update profile error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, title, company, location } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    user = new User({
      name,
      email,
      password,
      title: title || '',
      company: company || '',
      location: location || '',
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        title: user.title,
        company: user.company,
        location: user.location,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
        experience: user.experience,
        connections: user.connectionCount,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        title: user.title,
        company: user.company,
        location: user.location,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
        experience: user.experience,
        connections: user.connectionCount,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      title: user.title,
      company: user.company,
      location: user.location,
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills,
      experience: user.experience,
      connections: user.connectionCount,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, upload.single('avatar'), async (req, res) => {
  try {
    const { name, title, company, location, bio, skills } = req.body;
    
    const updateData = {
      name,
      title,
      company,
      location,
      bio,
      skills: skills ? JSON.parse(skills) : [],
    };

    if (req.file) {
      updateData.avatar = req.file.path;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      title: user.title,
      company: user.company,
      location: user.location,
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills,
      experience: user.experience,
      connections: user.connectionCount,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
