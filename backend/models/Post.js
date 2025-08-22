// const mongoose = require('mongoose');

// const commentSchema = new mongoose.Schema({
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   likes: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     likedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   }],
// }, { timestamps: true });

// const postSchema = new mongoose.Schema({
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type: String,
//     default: '',
//   },
//   video: {
//     type: String,
//     default: '',
//   },
//   likes: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     likedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   }],
//   comments: [commentSchema],
//   shares: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     sharedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   }],
//   visibility: {
//     type: String,
//     enum: ['public', 'connections', 'private'],
//     default: 'public',
//   },
//   tags: [{
//     type: String,
//   }],
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
// }, { timestamps: true });

// // Virtual for like count
// postSchema.virtual('likeCount').get(function() {
//   return this.likes.length;
// });

// // Virtual for comment count
// postSchema.virtual('commentCount').get(function() {
//   return this.comments.length;
// });

// // Virtual for share count
// postSchema.virtual('shareCount').get(function() {
//   return this.shares.length;
// });

// module.exports = mongoose.model('Post', postSchema);


import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    likedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  video: {
    type: String,
    default: '',
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    likedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  comments: [commentSchema],
  shares: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sharedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  visibility: {
    type: String,
    enum: ['public', 'connections', 'private'],
    default: 'public',
  },
  tags: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Virtual for like count
postSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

// Virtual for share count
postSchema.virtual('shareCount').get(function () {
  return this.shares.length;
});

const Post = mongoose.model('Post', postSchema);

export default Post;
