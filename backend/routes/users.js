// const express = require('express');
// const User = require('../models/User');
// const auth = require('../middleware/auth');

// const router = express.Router();

// // @route   GET /api/users
// // @desc    Get users for networking
// // @access  Private
// router.get('/', auth, async (req, res) => {
//   try {
//     const { page = 1, limit = 12, search, location, company } = req.query;
//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     // Build filter object
//     const filter = { _id: { $ne: req.user._id } };
    
//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { title: { $regex: search, $options: 'i' } },
//         { company: { $regex: search, $options: 'i' } },
//         { skills: { $in: [new RegExp(search, 'i')] } },
//       ];
//     }
    
//     if (location) {
//       filter.location = { $regex: location, $options: 'i' };
//     }
    
//     if (company) {
//       filter.company = { $regex: company, $options: 'i' };
//     }

//     const users = await User.find(filter)
//       .select('-password -connectionRequests')
//       .skip(skip)
//       .limit(parseInt(limit))
//       .sort({ lastActive: -1 });

//     const total = await User.countDocuments(filter);

//     // Check connection status for each user
//     const currentUser = await User.findById(req.user._id);
//     const usersWithConnectionStatus = users.map(user => {
//       const isConnected = currentUser.connections.some(
//         conn => conn.user.toString() === user._id.toString() && conn.status === 'accepted'
//       );
      
//       // Calculate mutual connections (simplified)
//       const mutualConnections = Math.floor(Math.random() * 50); // Mock data for now

//       return {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         title: user.title,
//         company: user.company,
//         location: user.location,
//         bio: user.bio,
//         avatar: user.avatar,
//         skills: user.skills,
//         experience: user.experience,
//         connections: user.connectionCount,
//         isConnected,
//         mutualConnections,
//       };
//     });

//     res.json({
//       users: usersWithConnectionStatus,
//       pagination: {
//         current: parseInt(page),
//         pages: Math.ceil(total / parseInt(limit)),
//         total,
//       },
//     });
//   } catch (error) {
//     console.error('Get users error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   GET /api/users/:id
// // @desc    Get user profile
// // @access  Private
// router.get('/:id', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const currentUser = await User.findById(req.user._id);
//     const isConnected = currentUser.connections.some(
//       conn => conn.user.toString() === user._id.toString() && conn.status === 'accepted'
//     );

//     res.json({
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       title: user.title,
//       company: user.company,
//       location: user.location,
//       bio: user.bio,
//       avatar: user.avatar,
//       skills: user.skills,
//       experience: user.experience,
//       connections: user.connectionCount,
//       isConnected,
//     });
//   } catch (error) {
//     console.error('Get user error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/users/:id/connect
// // @desc    Send connection request
// // @access  Private
// router.post('/:id/connect', auth, async (req, res) => {
//   try {
//     const { message } = req.body;
//     const targetUserId = req.params.id;
    
//     if (targetUserId === req.user._id.toString()) {
//       return res.status(400).json({ message: 'Cannot connect to yourself' });
//     }

//     const targetUser = await User.findById(targetUserId);
//     if (!targetUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const currentUser = await User.findById(req.user._id);
    
//     // Check if already connected
//     const existingConnection = currentUser.connections.find(
//       conn => conn.user.toString() === targetUserId
//     );
    
//     if (existingConnection) {
//       if (existingConnection.status === 'accepted') {
//         return res.status(400).json({ message: 'Already connected' });
//       } else if (existingConnection.status === 'pending') {
//         return res.status(400).json({ message: 'Connection request already sent' });
//       }
//     }

//     // Check if there's already a pending request from target user
//     const existingRequest = targetUser.connectionRequests.find(
//       req => req.from.toString() === currentUser._id.toString()
//     );
    
//     if (existingRequest) {
//       return res.status(400).json({ message: 'Connection request already sent' });
//     }

//     // Add connection request to target user
//     targetUser.connectionRequests.push({
//       from: req.user._id,
//       message: message || '',
//     });

//     // Add pending connection to current user
//     currentUser.connections.push({
//       user: targetUserId,
//       status: 'pending',
//     });

//     await targetUser.save();
//     await currentUser.save();

//     res.json({ message: 'Connection request sent successfully' });
//   } catch (error) {
//     console.error('Connect user error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/users/connection-requests/:id/accept
// // @desc    Accept connection request
// // @access  Private
// router.post('/connection-requests/:id/accept', auth, async (req, res) => {
//   try {
//     const requestId = req.params.id;
//     const currentUser = await User.findById(req.user._id);
    
//     const requestIndex = currentUser.connectionRequests.findIndex(
//       req => req._id.toString() === requestId
//     );
    
//     if (requestIndex === -1) {
//       return res.status(404).json({ message: 'Connection request not found' });
//     }

//     const request = currentUser.connectionRequests[requestIndex];
//     const fromUserId = request.from;

//     // Remove the request
//     currentUser.connectionRequests.splice(requestIndex, 1);

//     // Add connection to both users
//     currentUser.connections.push({
//       user: fromUserId,
//       status: 'accepted',
//     });

//     const fromUser = await User.findById(fromUserId);
//     const connectionIndex = fromUser.connections.findIndex(
//       conn => conn.user.toString() === req.user._id.toString()
//     );
    
//     if (connectionIndex > -1) {
//       fromUser.connections[connectionIndex].status = 'accepted';
//     } else {
//       fromUser.connections.push({
//         user: req.user._id,
//         status: 'accepted',
//       });
//     }

//     await currentUser.save();
//     await fromUser.save();

//     res.json({ message: 'Connection request accepted' });
//   } catch (error) {
//     console.error('Accept connection error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   GET /api/users/connection-requests
// // @desc    Get connection requests
// // @access  Private
// router.get('/connection-requests', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id)
//       .populate('connectionRequests.from', 'name title company avatar');

//     res.json(user.connectionRequests);
//   } catch (error) {
//     console.error('Get connection requests error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;

import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get users for networking
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 12, search, location, company } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter object
    const filter = { _id: { $ne: req.user._id } };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (company) {
      filter.company = { $regex: company, $options: 'i' };
    }

    const users = await User.find(filter)
      .select('-password -connectionRequests')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ lastActive: -1 });

    const total = await User.countDocuments(filter);

    // Check connection status for each user
    const currentUser = await User.findById(req.user._id);
    const usersWithConnectionStatus = users.map(user => {
      const isConnected = currentUser.connections.some(
        conn => conn.user.toString() === user._id.toString() && conn.status === 'accepted'
      );
      
      // Calculate mutual connections (mock for now)
      const mutualConnections = Math.floor(Math.random() * 50);

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        title: user.title,
        company: user.company,
        location: user.location,
        bio: user.bio,
        avatar: user.avatar,
        skills: user.skills,
        experience: user.experience,
        connections: user.connectionCount,
        isConnected,
        mutualConnections,
      };
    });

    res.json({
      users: usersWithConnectionStatus,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(req.user._id);
    const isConnected = currentUser.connections.some(
      conn => conn.user.toString() === user._id.toString() && conn.status === 'accepted'
    );

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      title: user.title,
      company: user.company,
      location: user.location,
      bio: user.bio,
      avatar: user.avatar,
      skills: user.skills,
      experience: user.experience,
      connections: user.connectionCount,
      isConnected,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/:id/connect
// @desc    Send connection request
// @access  Private
router.post('/:id/connect', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const targetUserId = req.params.id;
    
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot connect to yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(req.user._id);
    
    // Check if already connected
    const existingConnection = currentUser.connections.find(
      conn => conn.user.toString() === targetUserId
    );
    
    if (existingConnection) {
      if (existingConnection.status === 'accepted') {
        return res.status(400).json({ message: 'Already connected' });
      } else if (existingConnection.status === 'pending') {
        return res.status(400).json({ message: 'Connection request already sent' });
      }
    }

    // Check if there's already a pending request from target user
    const existingRequest = targetUser.connectionRequests.find(
      req => req.from.toString() === currentUser._id.toString()
    );
    
    if (existingRequest) {
      return res.status(400).json({ message: 'Connection request already sent' });
    }

    // Add connection request to target user
    targetUser.connectionRequests.push({
      from: req.user._id,
      message: message || '',
    });

    // Add pending connection to current user
    currentUser.connections.push({
      user: targetUserId,
      status: 'pending',
    });

    await targetUser.save();
    await currentUser.save();

    res.json({ message: 'Connection request sent successfully' });
  } catch (error) {
    console.error('Connect user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/connection-requests/:id/accept
// @desc    Accept connection request
// @access  Private
router.post('/connection-requests/:id/accept', auth, async (req, res) => {
  try {
    const requestId = req.params.id;
    const currentUser = await User.findById(req.user._id);
    
    const requestIndex = currentUser.connectionRequests.findIndex(
      req => req._id.toString() === requestId
    );
    
    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    const request = currentUser.connectionRequests[requestIndex];
    const fromUserId = request.from;

    // Remove the request
    currentUser.connectionRequests.splice(requestIndex, 1);

    // Add connection to both users
    currentUser.connections.push({
      user: fromUserId,
      status: 'accepted',
    });

    const fromUser = await User.findById(fromUserId);
    const connectionIndex = fromUser.connections.findIndex(
      conn => conn.user.toString() === req.user._id.toString()
    );
    
    if (connectionIndex > -1) {
      fromUser.connections[connectionIndex].status = 'accepted';
    } else {
      fromUser.connections.push({
        user: req.user._id,
        status: 'accepted',
      });
    }

    await currentUser.save();
    await fromUser.save();

    res.json({ message: 'Connection request accepted' });
  } catch (error) {
    console.error('Accept connection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/connection-requests
// @desc    Get connection requests
// @access  Private
router.get('/connection-requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('connectionRequests.from', 'name title company avatar');

    res.json(user.connectionRequests);
  } catch (error) {
    console.error('Get connection requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;


