require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/eventSchema'); 
const { ObjectId } = mongoose.Types;

const router = express.Router();

const MONGO_URI = process.env.MONGO_URI;

// Function to connect MongoDB using Mongoose
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

// ✅ GET all events
router.get('/', async (req, res) => {
    try {
        const allEvents = await Event.find();
        res.status(200).json(allEvents);
    } catch (err) {
        res.status(500).send("Error fetching events: " + err.message);
    }
});


// ✅ GET event by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid Event ID");
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).send("Event not found");
        }

        res.status(200).json(event);
    } catch (err) {
        res.status(500).send("Error fetching event: " + err.message);
    }
});




router.get("/", async (req, res) => {
    try {
        const { ispublic } = req.query; // Get query parameter
        
        let query = {}; // Default: fetch all events
        if (ispublic) {
            query.ispublic = ispublic === "true"; // Convert to Boolean
        }

        const allEvents = await Event.find(query);
        res.status(200).json(allEvents);
    } catch (err) {
        res.status(500).json({ error: "Error fetching events", message: err.message });
    }
});


// ✅ POST request
router.post('/', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        const savedEvent = await newEvent.save();
        res.status(201).send(`Event added with ID: ${savedEvent._id}`);
    } catch (err) {
        res.status(500).send("Error adding event: " + err.message);
    }
});

// ✅ PUT request (update event by name)

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Ensure the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID format");
        }

        const result = await Event.updateOne({ _id: id }, { $set: updatedData });

        if (result.matchedCount === 0) {
            return res.status(404).send("Event not found");
        }
        res.status(200).send("Event updated successfully");
    } catch (err) {
        res.status(500).send("Error updating event: " + err.message);
    }
});


// ✅ DELETE request (delete event by name)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid event ID");
        }

        const result = await Event.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).send("Event not found");
        }

        res.status(200).send("Event deleted successfully");
    } catch (err) {
        res.status(500).send("Error deleting event: " + err.message);
    }
});

module.exports = router;
