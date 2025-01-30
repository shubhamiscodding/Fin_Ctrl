const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/eventSchema'); 

const router = express.Router();

const url = 'mongodb+srv://shubhammodicg:9099@cluster1.zi1vg.mongodb.net/login-detail';

// Function to connect MongoDB using Mongoose
async function connectDB() {
    try {
        await mongoose.connect(url, {
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

// ✅ GET all events (Fixed)
router.get('/', async (req, res) => {
    try {
        const allEvents = await Event.find(); // Use Mongoose's find()
        res.status(200).json(allEvents);
    } catch (err) {
        res.status(500).send("Error fetching events: " + err.message);
    }
});

// ✅ POST request (Now properly saves default values)
router.post('/', async (req, res) => {
    try {
        const newEvent = new Event(req.body); // Mongoose handles defaults
        const savedEvent = await newEvent.save();
        res.status(201).send(`Event added with ID: ${savedEvent._id}`);
    } catch (err) {
        res.status(500).send("Error adding event: " + err.message);
    }
});


router.put('/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const updatedData = req.body;
        const result = await Event.updateOne({ name }, { $set: updatedData });

        if (result.matchedCount === 0) {
            return res.status(404).send("Event not found");
        }
        res.status(200).send("Event updated successfully");
    } catch (err) {
        res.status(500).send("Error updating event: " + err.message);
    }
});

module.exports = router;
