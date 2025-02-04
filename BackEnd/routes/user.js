const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/userSchema'); // Import User schema
const Admin = require('../models/adminSchema');

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


router.put('/add-to-admin/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const admin = await Admin.findOne({ 
            adminname: user.adminname, 
            passforuser: user.passforuser 
        });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found or invalid credentials" });
        }

        // Check if user is already in managedusers
        const isUserAlreadyManaged = admin.managedusers.some((managedUser) =>
            managedUser.userId.equals(user._id)
        );

        if (!isUserAlreadyManaged) {
            admin.managedusers.push({
                userId: user._id,
                username:user.username,
                email:user.email,
                events: user.events.map(event => ({
                    eventId: new mongoose.Types.ObjectId(),  // Generate a unique eventId
                    eventName: event.eventName,
                    budget: event.budget,
                    expenses: event.expenses || [], // Ensure expenses array is included
                    totalSpent: event.totalSpent || 0,
                    remainingBudget: event.remainingBudget || event.budget, // Default to budget
                  })),
                financeData: user.financePlans
            });

            await admin.save();
            return res.status(200).json({ message: `User ${user.username} added to admin ${admin.adminname}` });
        } else {
            return res.status(400).json({ message: "User is already managed by this admin" });
        }
    } catch (err) {
        res.status(500).json({ error: "Error adding user to admin: " + err.message });
    }
});


module.exports = router;
