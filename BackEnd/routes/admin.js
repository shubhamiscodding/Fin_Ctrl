const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminSchema");
const Event = require("../models/eventSchema"); // Import Event model

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT (For protected routes)
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only" });
    }

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Register Admin (Unprotected)
router.post("/register", async (req, res) => {
  const { adminName, email, password, passForUser } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = new Admin({
      adminName,
      email,
      password, // Encrypted via pre-save hook in AdminSchema
      passForUser,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Get All Admins (Protected, but should this be /login?)
router.get("/login", verifyToken, async (req, res) => {
  try {
    const allAdmins = await Admin.find();
    res.status(200).json(allAdmins);
  } catch (err) {
    res.status(500).send("Error fetching admins: " + err.message);
  }
});

// Get Managed Users (Protected)
router.get("/users", verifyToken, async (req, res) => {
  try {
    const adminId = req.user.id; // Extract admin ID from JWT
    const admin = await Admin.findById(adminId).populate("managedUsers.userId");

    if (!admin || admin.managedUsers.length === 0) {
      return res.status(404).json({ message: "No users found for this admin" });
    }

    res.status(200).json(admin.managedUsers);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Get Events (Protected) - Fetch admin's events and managed users' events
router.get("/events", verifyToken, async (req, res) => {
  try {
    const adminId = req.user.id; // Extract admin ID from JWT

    // Fetch the admin with their events
    const admin = await Admin.findById(adminId).populate("events");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Fetch events created by the admin directly
    const adminEvents = admin.events.length > 0 ? admin.events : [];

    // Fetch events created by managed users
    const managedUserIds = admin.managedUsers.map((mu) => mu.userId);
    const userEvents = await Event.find({
      createdBy: { $in: managedUserIds },
      createdByModel: "User",
    });

    // Combine and deduplicate events (if needed)
    const allEvents = [...adminEvents, ...userEvents];

    if (allEvents.length === 0) {
      return res.status(404).json({ message: "No events found for this admin or their managed users" });
    }

    res.status(200).json(allEvents);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

module.exports = router;