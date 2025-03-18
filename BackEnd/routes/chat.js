const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const Admin = require('../models/adminSchema');
const Message = require('../models/Message');

const auth = (req, res, next) => {
  console.log('Chat auth triggered');
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Received token:', token);
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    console.log('Verifying with JWT_SECRET:', secret);
    const decoded = jwt.verify(token, secret);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (e) {
    console.error('Token verification failed:', e.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/chat-list', auth, async (req, res) => {
  console.log('Chat list route hit, user:', req.user);
  try {
    const user = req.user.role === 'admin' 
      ? await Admin.findById(req.user.id).lean() 
      : await User.findById(req.user.id).lean();
    console.log('Fetched user:', user);

    if (req.user.role === 'admin') {
      const users = await User.find({ _id: { $in: user.managedUsers.map(u => u.userId) } }).lean();
      const chatList = await Promise.all(users.map(async (u) => {
        const unreadCount = await Message.countDocuments({
          sender: u._id,
          receiver: req.user.id,
          isRead: false,
        });
        return { ...u, unreadCount };
      }));
      console.log('Managed users with unread counts:', chatList);
      res.json(chatList);
    } else {
      const adminId = user.admin;
      console.log('User admin ID:', adminId);
      const admin = await Admin.findById(adminId).lean();
      console.log('Assigned admin:', admin);
      if (!admin) {
        console.log('No valid admin found for user');
        return res.json([]);
      }
      const unreadCount = await Message.countDocuments({
        sender: adminId,
        receiver: req.user.id,
        isRead: false,
      });
      res.json([{ ...admin, unreadCount }]);
    }
  } catch (err) {
    console.error('Chat list error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/messages/:receiverId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.receiverId },
        { sender: req.params.receiverId, receiver: req.user.id },
      ],
    }).sort('timestamp');
    console.log('Messages fetched:', messages);

    // Mark messages as read when fetched
    await Message.updateMany(
      { sender: req.params.receiverId, receiver: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    console.log('Messages marked as read for:', req.params.receiverId);

    res.json(messages);
  } catch (err) {
    console.error('Messages fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = (io) => {
  router.io = io;

  io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);

    socket.on('join', ({ userId, role }) => {
      console.log('User joined:', userId, role);
      socket.join(userId);
    });

    socket.on('sendMessage', async (msg) => {
      console.log('Message received:', msg);
      const message = new Message(msg);
      await message.save();
      console.log('Message saved to DB:', message);

      // Emit message to both sender and receiver
      io.to(msg.receiver).emit('receiveMessage', message);
      io.to(msg.sender).emit('receiveMessage', message);

      // Emit notification to receiver
      io.to(msg.receiver).emit('newMessageNotification', {
        senderId: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp,
      });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  return router;
};