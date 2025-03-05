require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Event = require("../models/eventSchema");
const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");

const router = express.Router();

// Middleware to verify JWT (Should be extracted to middleware/auth.js)
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }
  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// CREATE an event (Both Admins and Users)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { eventName, budget, description, dateofevent, ispublic } = req.body;
    const creatorId = req.user.id;
    const role = req.user.role;

    // Validate required fields
    if (!eventName || budget === undefined) {
      return res.status(400).json({ message: "Event name and budget are required" });
    }

    const newEvent = new Event({
      eventName,
      budget: Number(budget),
      description: description || "N/A",
      dateofevent: dateofevent || Date.now(),
      ispublic: ispublic !== undefined ? ispublic : false,
      createdBy: creatorId,
      createdByModel: role === "admin" ? "Admin" : "User",
    });

    const savedEvent = await newEvent.save();

    // Update creator's events array
    const Model = role === "admin" ? Admin : User;
    await Model.findByIdAndUpdate(creatorId, { $push: { events: savedEvent._id } });

    res.status(201).json({ message: "Event created successfully", event: savedEvent });
  } catch (err) {
    console.error("Error creating event:", err.stack);
    res.status(500).json({ message: "Error creating event: " + err.message });
  }
});

// GET all events (Admins see all, Users see their own)
router.get("/", verifyToken, async (req, res) => {
  try {
    const { ispublic } = req.query;
    let query = {};

    if (req.user.role === "admin") {
      if (ispublic !== undefined) {
        query.ispublic = ispublic === "true";
      }
    } else {
      query.createdBy = req.user.id;
      query.createdByModel = "User";
      if (ispublic !== undefined) {
        query.ispublic = ispublic === "true";
      }
    }

    const events = await Event.find(query).sort({ dateofevent: -1 });
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events:", err.stack);
    res.status(500).json({ message: "Error fetching events: " + err.message });
  }
});

// GET all public events (Authenticated users only)
router.get("/public", verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const publicEvents = await Event.find({ ispublic: true })
      .sort({ dateofevent: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select("-createdBy -createdByModel");

    const total = await Event.countDocuments({ ispublic: true });

    if (publicEvents.length === 0) {
      return res.status(404).json({ message: "No public events found" });
    }

    res.status(200).json({
      events: publicEvents,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching public events: " + err.message });
  }
});

// GET event by ID (Authenticated users only)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Event ID" });
    }

    const event = await Event.findById(id).populate("expenses");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check permissions (admins or creator only)
    if (req.user.role !== "admin" && event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to view this event" });
    }

    res.status(200).json(event);
  } catch (err) {
    console.error("Error fetching event:", err.stack);
    res.status(500).json({ message: "Error fetching event: " + err.message });
  }
});

// UPDATE event by ID (Creator or admin only)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { eventName, budget, description, dateofevent, ispublic } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Event ID" });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check permissions
    if (req.user.role !== "admin" && event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this event" });
    }

    const updatedData = {};
    if (eventName) updatedData.eventName = eventName;
    if (budget !== undefined) updatedData.budget = Number(budget);
    if (description) updatedData.description = description;
    if (dateofevent) updatedData.dateofevent = dateofevent;
    if (ispublic !== undefined) updatedData.ispublic = ispublic;

    const updatedEvent = await Event.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
    res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
  } catch (err) {
    console.error("Error updating event:", err.stack);
    res.status(500).json({ message: "Error updating event: " + err.message });
  }
});

// DELETE event by ID (Creator or admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Event ID" });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check permissions
    if (req.user.role !== "admin" && event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this event" });
    }

    await Event.findByIdAndDelete(id);

    const Model = req.user.role === "admin" ? Admin : User;
    await Model.findByIdAndUpdate(req.user.id, { $pull: { events: id } });

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err.stack);
    res.status(500).json({ message: "Error deleting event: " + err.message });
  }
});


// to update the expenses of an event
router.post("/:id/expenses", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, description, amount, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Event ID" });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (req.user.role !== "admin" && event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to add expenses to this event" });
    }

    if (!date || !description || !amount || !category) {
      return res.status(400).json({ message: "Date, description, amount, and category are required" });
    }

    event.expenses.push({ date, description, amount: Number(amount), category });
    await event.save();

    res.status(200).json({ message: "Expense added successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

module.exports = router;