const express = require('express');
const mongoose = require('mongoose');
const Admin = require('../models/adminSchema'); // Import Admin schema

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

// ✅ GET all admins
router.get('/', async (req, res) => {
    try {
        const allAdmins = await Admin.find(); // Mongoose handles find()
        res.status(200).json(allAdmins);
    } catch (err) {
        res.status(500).send("Error fetching admins: " + err.message);
    }
});

// ✅ POST request (Mongoose automatically applies default values)
router.post('/', async (req, res) => {
    try {
        const newAdmin = new Admin(req.body); // Create a new Admin instance
        const savedAdmin = await newAdmin.save(); // Save it to MongoDB
        res.status(201).send(`Admin added with ID: ${savedAdmin._id}`);
    } catch (err) {
        res.status(500).send("Error adding admin: " + err.message);
    }
});

// ✅ PUT request (Updating admin by name)
router.put('/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const updatedData = req.body;
        const result = await Admin.updateOne({ name }, { $set: updatedData });

        if (result.matchedCount === 0) {
            return res.status(404).send("Admin not found");
        }
        res.status(200).send("Admin updated successfully");
    } catch (err) {
        res.status(500).send("Error updating admin: " + err.message);
    }
});

// ✅ DELETE request (Deleting admin by username)
router.delete('/:user', async (req, res) => {
    try {
        const { user } = req.params;
        const result = await Admin.deleteOne({ user });

        if (result.deletedCount === 0) {
            return res.status(404).send("Admin not found");
        }
        res.status(200).send("Admin deleted successfully");
    } catch (err) {
        res.status(500).send("Error deleting admin: " + err.message);
    }
});

module.exports = router;
