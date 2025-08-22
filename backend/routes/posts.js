import express from 'express';
import Post from '../models/Post.js';
import auth from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isActive: true })
      .populate('author', 'name title company avatar')
      .populate('comments.author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ isActive: true });

    res.json({
      posts: posts.map(post => ({
        id: post._id,
        author: post.author,
        content: post.content,
        image: post.image,
        likes: post.likeCount,
        comments: post.comments.map(comment => ({
          id: comment._id,
          author: comment.author,
          content: comment.content,
          timestamp: comment.createdAt,
          likes: comment.likes.length,
        })),
        shares: post.shareCount,
        timestamp: post.createdAt,
        isLiked: post.likes.some(
          like => like.user.toString() === req.user._id.toString()
        ),
      })),
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { content, visibility = 'public' } = req.body;

    const postData = {
      author: req.user._id,
      content,
      visibility,
    };

    if (req.file) {
      postData.image = req.file.path;
    }

    const post = new Post(postData);
    await post.save();

    await post.populate('author', 'name title company avatar');

    res.status(201).json({
      id: post._id,
      author: post.author,
      content: post.content,
      image: post.image,
      likes: 0,
      comments: [],
      shares: 0,
      timestamp: post.createdAt,
      isLiked: false,
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.findIndex(
      like => like.user.toString() === req.user._id.toString()
    );

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push({ user: req.user._id });
    }

    await post.save();

    res.json({
      likes: post.likeCount,
      isLiked: likeIndex === -1,
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add comment to post
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      author: req.user._id,
      content,
    };

    post.comments.push(newComment);
    await post.save();

    await post.populate('comments.author', 'name avatar');

    const addedComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      id: addedComment._id,
      author: addedComment.author,
      content: addedComment.content,
      timestamp: addedComment.createdAt,
      likes: 0,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.isActive = false;
    await post.save();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
