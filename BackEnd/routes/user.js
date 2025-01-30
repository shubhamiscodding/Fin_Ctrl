const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/userSchema'); // Import User schema

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

// ✅ GET all users
router.get('/', async (req, res) => {
    try {
        const allUsers = await User.find(); // Mongoose handles find()
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).send("Error fetching users: " + err.message);
    }
});

// ✅ POST request (Mongoose automatically applies default values)
router.post('/', async (req, res) => {
    try {
        const newUser = new User(req.body); // Create a new User instance
        const savedUser = await newUser.save(); // Save it to MongoDB
        res.status(201).send(`User added with ID: ${savedUser._id}`);
    } catch (err) {
        res.status(500).send("Error adding user: " + err.message);
    }
});

// ✅ PUT request (Updating user by name)
router.put('/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const updatedData = req.body;
        const result = await User.updateOne({ name }, { $set: updatedData });

        if (result.matchedCount === 0) {
            return res.status(404).send("User not found");
        }
        res.status(200).send("User updated successfully");
    } catch (err) {
        res.status(500).send("Error updating user: " + err.message);
    }
});

module.exports = router;
