const express = require('express');
const mongoose = require('mongoose');
const Event = require('../models/eventSchema');

const router = express.Router();

const url = 'mongodb+srv://shubhammodicg:9099@cluster1.zi1vg.mongodb.net/';
const dbName = "login-detail";

let db, event;

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

router.get('/', async (req, res) => {  // Changed from '/events' to '/'
    try {
        const allevents = await event.find().toArray();
        res.status(200).json(allevents);
    } catch (err) {
        res.status(500).send("Error fetching events: " + err.message);
    }
});

router.post('/', async (req, res) => {  // Changed from '/events' to '/'
    try {
        const newEvent = new Event(req.body);
        const savedEvent = await newEvent.save();
        res.status(201).send(`Event added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding event: " + err.message);
    }
});

router.put('/:name', async (req, res) => {  // Changed from '/events/:name' to '/:name'
    try {
        const { name } = req.params;
        const updatedData = req.body;
        const result = await event.updateOne({ name }, { $set: updatedData });
        if (result.matchedCount === 0) {
            return res.status(404).send("Event not found");
        }
        res.status(200).send("Event updated successfully");
    } catch (err) {
        res.status(500).send("Error updating event: " + err.message);
    }
});

module.exports = router;
