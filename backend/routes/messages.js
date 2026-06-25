import express from 'express';
import Message from '../models/Message.js';
import auth from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// @route   POST /api/messages/upload
// @desc    Upload message image attachment
// @access  Private
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ imagePath: req.file.path });
  } catch (error) {
    console.error('Error uploading message image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/messages/:userId
// @desc    Get message history between current user and target user
// @access  Private
router.get('/:userId', auth, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.userId || req.params.userId;

    // Find messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: targetUserId },
        { sender: targetUserId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    // Mark messages sent by target user as read
    await Message.updateMany(
      { sender: targetUserId, receiver: currentUserId, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (error) {
    console.error('Error fetching message history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
