// const express = require('express');
// const mongoose = require('mongoose');
// const User = require('../models/userSchema'); // Import User schema
// const Admin = require('../models/adminSchema');

// const router = express.Router();


// const MONGO_URI = process.env.MONGO_URI;

// // Function to connect MongoDB using Mongoose
// async function connectDB() {
//     try {
//         await mongoose.connect(MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//         console.log("Connected to MongoDB");
//     } catch (err) {
//         console.error("Error connecting to MongoDB:", err);
//         process.exit(1);
//     }
// }

// connectDB();

// // ✅ GET all users
// router.get('/', /*checkJwt , */ async (req, res) => {
//     try {
//         const allUsers = await User.find(); // Mongoose handles find()
//         res.status(200).json(allUsers);
//     } catch (err) {
//         res.status(500).send("Error fetching users: " + err.message);
//     }
// });

// // ✅ POST request (Mongoose automatically applies default values)
// router.post('/', async (req, res) => {
//     try {
//         const newUser = new User(req.body); // Create a new User instance
//         const savedUser = await newUser.save(); // Save it to MongoDB
//         res.status(201).send(`User added with ID: ${savedUser._id}`);
//     } catch (err) {
//         res.status(500).send("Error adding user: " + err.message);
//     }
// });

// // ✅ PUT request (Updating user by name)
// router.put('/:name', async (req, res) => {
//     try {
//         const { name } = req.params;
//         const updatedData = req.body;
//         const result = await User.updateOne({ name }, { $set: updatedData });

//         if (result.matchedCount === 0) {
//             return res.status(404).send("User not found");
//         }
//         res.status(200).send("User updated successfully");
//     } catch (err) {
//         res.status(500).send("Error updating user: " + err.message);
//     }
// });


// router.put('/add-to-admin/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const user = await User.findById(userId);
        
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const admin = await Admin.findOne({ 
//             adminname: user.adminname, 
//             passforuser: user.passforuser 
//         });

//         if (!admin) {
//             return res.status(404).json({ message: "Admin not found or invalid credentials" });
//         }

//         // Check if user is already in managedusers
//         const isUserAlreadyManaged = admin.managedusers.some((managedUser) =>
//             managedUser.userId.equals(user._id)
//         );

//         if (!isUserAlreadyManaged) {
//             admin.managedusers.push({
//                 userId: user._id,
//                 username:user.username,
//                 email:user.email,
//                 events: user.events.map(event => ({
//                     eventId: new mongoose.Types.ObjectId(),  // Generate a unique eventId
//                     eventName: event.eventName,
//                     budget: event.budget,
//                     expenses: event.expenses || [], // Ensure expenses array is included
//                     totalSpent: event.totalSpent || 0,
//                     remainingBudget: event.remainingBudget || event.budget, // Default to budget
//                   })),
//                 financeData: user.financePlans
//             });

//             await admin.save();
//             return res.status(200).json({ message: `User ${user.username} added to admin ${admin.adminname}` });
//         } else {
//             return res.status(400).json({ message: "User is already managed by this admin" });
//         }
//     } catch (err) {
//         res.status(500).json({ error: "Error adding user to admin: " + err.message });
//     }
// });


// module.exports = router;









const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");

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
        const { name, email, password, adminId } = req.body;

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

        // ✅ Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            admin: adminId, // Associate user with admin
        });

        await user.save();

        // ✅ Correctly push to admin's managedUsers
        if (admin) {
            admin.managedUsers.push({ userId: newUser._id });
            await admin.save(); // 👈 Make sure this is saving correctly!
        }
        
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error: " + error.message });
    }
});





// ✅ User Login

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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // ✅ Generate JWT
        const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ token, role, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
});



// ✅ Get All Users (Protected)
router.get("/", verifyToken, async (req, res) => {
    try {
        const allUsers = await User.find();
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).send("Error fetching users: " + err.message);
    }
});


// ✅ Delete user route (protected)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.params.id;

        // Ensure only the user or an admin can delete the account
        if (req.user.role !== 'admin' && req.user.id !== userId) {
            return res.status(403).json({ message: "Access denied. Only admins or the user can delete this account" });
        }

        // Find and delete user
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user: " + error.message });
    }
});



module.exports = router;
