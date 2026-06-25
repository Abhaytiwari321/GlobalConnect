import express from 'express';
import cors from 'cors';
import path, { dirname, join } from 'path';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';

import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import jobRoutes from './routes/jobs.js';
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';
import aiRoutes from './routes/ai.js';

// Load environment variables
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use('/uploads', express.static(join(__dirname, 'uploads')));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Global Connect API is running!' });
});

// Serve frontend build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "../frontend/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(join(__dirname, "../frontend/dist/index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler (only for APIs, since frontend is served above)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Socket.IO connection handling
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  socket.on('register', (userId) => {
    activeUsers.set(userId, socket.id);
    console.log(`👤 User registered for chat: ${userId} with socket: ${socket.id}`);
  });

  socket.on('send_message', async (data) => {
    const { sender, receiver, content, image } = data;
    try {
      const { default: Message } = await import('./models/Message.js');
      const newMessage = await Message.create({ sender, receiver, content, image });

      const receiverSocketId = activeUsers.get(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', newMessage);
      }

      socket.emit('message_sent', newMessage);
    } catch (err) {
      console.error('Socket error sending message:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected:', socket.id);
    for (const [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});
