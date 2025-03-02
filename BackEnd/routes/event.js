require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Event = require("../models/eventSchema");
const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");
const { ObjectId } = mongoose.Types;

const router = express.Router();

const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}

connectDB();

// Middleware to verify JWT
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

// CREATE an event (Both Admins and Users can create)
router.post("/", verifyToken, async (req, res) => {
    try {
        const { eventName, budget, description, dateofevent, ispublic } = req.body;
        const creatorId = req.user.id;
        const role = req.user.role;

        const newEvent = new Event({
            eventName,
            budget,
            description,
            dateofevent,
            ispublic,
            createdBy: creatorId,
            createdByModel: role === "admin" ? "Admin" : "User",
        });

        const savedEvent = await newEvent.save();

        if (role === "user") {
            await User.findByIdAndUpdate(creatorId, { $push: { events: savedEvent._id } });
        } else if (role === "admin") {
            await Admin.findByIdAndUpdate(creatorId, { $push: { events: savedEvent._id } });
        }

        res.status(201).json({ message: "Event created successfully", eventId: savedEvent._id });
    } catch (err) {
        res.status(500).json({ message: "Error creating event: " + err.message });
    }
});

// GET all events (Admins see all, Users see only their own, with optional ispublic filter)
router.get("/", verifyToken, async (req, res) => {
    try {
        const { ispublic } = req.query;
        let query = {};

        if (req.user.role === "admin") {
            // Admins see all events with optional public filter
            if (ispublic !== undefined) {
                query.ispublic = ispublic === "true";
            }
            events = await Event.find(query);
        } else {
            // Users see only their own events with optional public filter
            query.createdBy = req.user.id;
            if (ispublic !== undefined) {
                query.ispublic = ispublic === "true";
            }
            events = await Event.find(query);
        }
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: "Error fetching events: " + err.message });
    }
});

// GET event by ID (authenticated users only)
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Event ID" });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if user has permission to view this event
        if (req.user.role !== "admin" && event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to view this event" });
        }

        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({ message: "Error fetching event: " + err.message });
    }
});

// UPDATE event by ID (creator or admin only)
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check permissions
        if (req.user.role !== "admin" && event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this event" });
        }

        const result = await Event.updateOne({ _id: id }, { $set: updatedData });

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error updating event: " + err.message });
    }
});

// DELETE event by ID (creator or admin only)
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`Attempting to delete event with ID: ${id}`);

        if (!ObjectId.isValid(id)) {
            console.log(`Invalid event ID: ${id}`);
            return res.status(400).json({ message: "Invalid event ID" });
        }

        const event = await Event.findById(id);
        if (!event) {
            console.log(`Event not found for ID: ${id}`);
            return res.status(404).json({ message: "Event not found" });
        }

        // Check permissions
        console.log(`User role: ${req.user.role}, User ID: ${req.user.id}, Event creator: ${event.createdBy}`);
        if (req.user.role !== "admin" && event.createdBy.toString() !== req.user.id) {
            console.log(`Unauthorized attempt by user ${req.user.id} to delete event ${id}`);
            return res.status(403).json({ message: "Unauthorized to delete this event" });
        }

        const deleteResult = await Event.deleteOne({ _id: id }); // Simplified, no need for new ObjectId
        console.log(`Delete result: ${JSON.stringify(deleteResult)}`);

        if (deleteResult.deletedCount === 0) {
            console.log(`No event deleted for ID: ${id}`);
            return res.status(404).json({ message: "Event not found" });
        }

        // Remove event reference from User or Admin
        if (req.user.role === "user") {
            const userUpdate = await User.findByIdAndUpdate(req.user.id, { $pull: { events: id } });
            console.log(`User update result: ${JSON.stringify(userUpdate)}`);
        } else if (req.user.role === "admin") {
            const adminUpdate = await Admin.findByIdAndUpdate(req.user.id, { $pull: { events: id } });
            console.log(`Admin update result: ${JSON.stringify(adminUpdate)}`);
        }

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        console.error(`Error in DELETE /event/${id}:`, err.stack); // Log full error stack
        res.status(500).json({ message: "Error deleting event: " + err.message });
    }
});

module.exports = router;