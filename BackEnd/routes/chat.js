const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const Admin = require('../models/adminSchema');
const Message = require('../models/Message');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/chat-list', auth, async (req, res) => {
  try {
    const user = req.user.role === 'admin'
      ? await Admin.findById(req.user.id).lean()
      : await User.findById(req.user.id).lean();

    if (req.user.role === 'admin') {
      const users = await User.find({
        _id: { $in: user.managedUsers.map(u => u.userId) }
      }).lean();

      const chatList = await Promise.all(users.map(async (u) => {
        const unreadCount = await Message.countDocuments({
          sender: u._id,
          senderModel: 'User',
          receiver: req.user.id,
          receiverModel: 'Admin',
          isRead: false
        });
        return { ...u, unreadCount };
      }));

      res.json(chatList);
    } else {
      const adminId = user.assignedAdmin;
      const admin = await Admin.findById(adminId).lean();
      if (!admin) return res.json([]);

      const unreadCount = await Message.countDocuments({
        sender: adminId,
        senderModel: 'Admin',
        receiver: req.user.id,
        receiverModel: 'User',
        isRead: false
      });

      res.json([{ ...admin, unreadCount }]);
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/messages/:receiverId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        {
          sender: req.user.id,
          receiver: req.params.receiverId,
          senderModel: req.user.role === 'admin' ? 'Admin' : 'User',
          receiverModel: req.user.role === 'admin' ? 'User' : 'Admin'
        },
        {
          sender: req.params.receiverId,
          receiver: req.user.id,
          senderModel: req.user.role === 'admin' ? 'User' : 'Admin',
          receiverModel: req.user.role === 'admin' ? 'Admin' : 'User'
        }
      ]
    }).sort('timestamp');

    await Message.updateMany({
      sender: req.params.receiverId,
      receiver: req.user.id,
      senderModel: req.user.role === 'admin' ? 'User' : 'Admin',
      receiverModel: req.user.role === 'admin' ? 'Admin' : 'User',
      isRead: false
    }, { $set: { isRead: true } });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = (io) => {
  router.io = io;

  io.on('connection', (socket) => {
    socket.on('join', ({ userId }) => {
      socket.join(userId);
    });

    socket.on('sendMessage', async (msg) => {
      const message = new Message({
        sender: msg.sender,
        receiver: msg.receiver,
        senderModel: msg.senderModel,
        receiverModel: msg.receiverModel,
        content: msg.content,
        timestamp: msg.timestamp || Date.now()
      });
      await message.save();

      io.to(msg.receiver).emit('receiveMessage', message);
      io.to(msg.sender).emit('receiveMessage', message);

      io.to(msg.receiver).emit('newMessageNotification', {
        senderId: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp
      });
    });

    socket.on('disconnect', () => {
      // optional logging
    });
  });

  return router;
};
