const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");
const Event = require("../models/eventSchema"); // Import Event model

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// 🔒 Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// ✅ User Registration (Signup)
router.post("/registration", async (req, res) => {
  try {
    const requestId = Math.random().toString(36).substring(7); // Random ID for each request
    console.log(`[${requestId}] Registration request received:`, req.body);

    const { username, email, password, adminId } = req.body;

    // ✅ Validate adminId
    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    // ✅ Check if the admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // ✅ Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Create new user (password hashing handled by schema pre-save hook)
    user = new User({
      username,
      email,
      password, // Will be hashed by UserSchema pre-save hook
      admin: adminId,
    });

    await user.save();
    console.log(`[${requestId}] User saved:`, user._id);

    // ✅ Push user to admin's managedUsers
    admin.managedUsers.push({ userId: user._id });
    await admin.save(); // Uncommented to ensure admin is updated
    console.log(`[${requestId}] Admin updated:`, admin.managedUsers);

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// ✅ User/Admin Login
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;
    if (role === "admin") {
      user = await Admin.findOne({ email });
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Generate JWT
    const token = user.generateAuthToken(); // Use schema method
    res.json({ token, role, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// ✅ Get User’s Events (Protected)
router.get("/events", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Ensure the requester is a user, not an admin
    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admins should use /admin/events" });
    }

    // Fetch user and their events
    const user = await User.findById(userId).populate("events");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userEvents = user.events.length > 0 ? user.events : [];
    if (userEvents.length === 0) {
      return res.status(404).json({ message: "No events found for this user" });
    }

    res.status(200).json(userEvents);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// ✅ Get User Profile (Protected)
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admins should use admin routes" });
    }

    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// ✅ Update User Profile (Protected)
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;

    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admins should use admin routes" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// ✅ Get All Users (Protected, Admin-Only)
router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only" });
    }

    const allUsers = await User.find().select("-password"); // Exclude passwords
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).send("Error fetching users: " + err.message);
  }
});

// ✅ Delete User (Protected)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;

    // Ensure only the user or an admin can delete the account
    if (req.user.role !== "admin" && req.user.id !== userId) {
      return res.status(403).json({ message: "Access denied. Only admins or the user can delete this account" });
    }

    // Find and delete user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove from admin's managedUsers (if applicable)
    if (deletedUser.admin) {
      await Admin.updateOne(
        { _id: deletedUser.admin },
        { $pull: { "managedUsers": { userId: deletedUser._id } } }
      );
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user: " + error.message });
  }
});

module.exports = router;