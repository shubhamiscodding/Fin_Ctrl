const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const Admin = require('../models/adminSchema');
const Event = require('../models/eventSchema'); // Import Event model

const router = express.Router();

// 🔒 Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Verify token:', token); // Debug
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    console.log('Verifying with JWT_SECRET:', secret); // Debug
    const decoded = jwt.verify(token, secret);
    console.log('Decoded token:', decoded); // Debug
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(400).json({ message: 'Invalid token' });
  }
};

// ✅ User Registration (Signup)
router.post('/registration', async (req, res) => {
  try {
    const requestId = Math.random().toString(36).substring(7); // Random ID for each request
    console.log(`[${requestId}] Registration request received:`, req.body);

    const { username, email, password, adminName, passForUser } = req.body;

    // Validate required fields
    if (!username || !email || !password || !adminName || !passForUser) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (password hashing handled by schema pre-save hook)
    user = new User({
      username,
      email,
      password, // Will be hashed by UserSchema pre-save hook
      adminName,
      passForUser,
      assignedAdmin: adminName // Set assignedAdmin to the adminName
    });

    await user.save();
    console.log(`[${requestId}] User saved:`, user._id);

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error(`[${requestId}] Signup error:`, error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// ✅ User/Admin Login
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    let user = role === 'admin' ? await Admin.findOne({ email }) : await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT
    const token = user.generateAuthToken();
    console.log('Generated token:', token); // Debug
    res.json({
      token,
      role,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        username: user.username || undefined,
        adminName: user.adminName || undefined,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// ✅ Get User’s Events (Protected)
router.get('/events', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Ensure the requester is a user, not an admin
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins should use /admin/events' });
    }

    // Fetch user and their events
    const user = await User.findById(userId).populate('events');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userEvents = user.events.length > 0 ? user.events : [];
    if (userEvents.length === 0) {
      return res.status(404).json({ message: 'No events found for this user' });
    }

    res.status(200).json(userEvents);
  } catch (error) {
    console.error('Events fetch error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// ✅ Get User Profile (Protected)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let user = role === 'admin' ? await Admin.findById(userId) : await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({
      id: user._id,
      email: user.email,
      role: user.role,
      username: user.username || undefined,
      adminName: user.adminName || undefined,
      picture: user.picture || undefined,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// ✅ Update User Profile (Protected)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const { username, email, picture, adminName } = req.body;

    let user = role === 'admin' ? await Admin.findById(userId) : await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: `${role} not found` });
    }

    // Update fields based on role
    if (role === 'admin') {
      if (adminName) user.adminName = adminName;
      if (email) user.email = email;
      if (picture) user.picture = picture;
    } else {
      if (username) user.username = username;
      if (email) user.email = email;
      if (picture) user.picture = picture;
    }

    await user.save();
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        username: user.username || undefined,
        adminName: user.adminName || undefined,
        picture: user.picture || undefined,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// ✅ Get All Users (Protected, Admin-Only)
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only' });
    }

    const allUsers = await User.find().select('-password');
    res.status(200).json(allUsers);
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ message: 'Error fetching users: ' + error.message });
  }
});

// ✅ Delete User (Protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;

    // Ensure only the user or an admin can delete the account
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied. Only admins or the user can delete this account' });
    }

    // Find and delete user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from admin's managedUsers
    if (deletedUser.assignedAdmin) {
      await Admin.updateOne(
        { _id: deletedUser.assignedAdmin },
        { $pull: { managedUsers: { userId: deletedUser._id } } }
      );
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user: ' + error.message });
  }
});

module.exports = router;