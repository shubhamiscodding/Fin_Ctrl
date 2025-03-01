// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const jwt = require("express-jwt");
// const jwksRsa = require("jwks-rsa");
// const Admin = require('../models/adminSchema'); // Import Admin schema

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

// // ✅ GET all admins
// router.get('/', /*checkJwt, */async (req, res) => {
//     try {
//         const allAdmins = await Admin.find(); // Mongoose handles find()
//         res.status(200).json(allAdmins);
//     } catch (err) {
//         res.status(500).send("Error fetching admins: " + err.message);
//     }
// });

// // ✅ POST request (Mongoose automatically applies default values)
// router.post('/', async (req, res) => {
//     try {
//         const newAdmin = new Admin(req.body); // Create a new Admin instance
//         const savedAdmin = await newAdmin.save(); // Save it to MongoDB
//         res.status(201).send(`Admin added with ID: ${savedAdmin._id}`);
//     } catch (err) {
//         res.status(500).send("Error adding admin: " + err.message);
//     }
// });

// // ✅ PUT request (Updating admin by name)
// router.put('/:name', async (req, res) => {
//     try {
//         const { name } = req.params;
//         const updatedData = req.body;
//         const result = await Admin.updateOne({ name }, { $set: updatedData });

//         if (result.matchedCount === 0) {
//             return res.status(404).send("Admin not found");
//         }
//         res.status(200).send("Admin updated successfully");
//     } catch (err) {
//         res.status(500).send("Error updating admin: " + err.message);
//     }
// });

// // ✅ DELETE request (Deleting admin by username)
// router.delete('/:user', async (req, res) => {
//     try {
//         const { user } = req.params;
//         const result = await Admin.deleteOne({ user });

//         if (result.deletedCount === 0) {
//             return res.status(404).send("Admin not found");
//         }
//         res.status(200).send("Admin deleted successfully");
//     } catch (err) {
//         res.status(500).send("Error deleting admin: " + err.message);
//     }
// });


// router.get("/admin/:adminId/managed-users", async (req, res) => {
//     try {
//         const admin = await Admin.findById(req.params.adminId)
//             .populate({
//                 path: "managedUsers.userId",
//                 select: "name email",
//             })
//             .populate({
//                 path: "managedUsers.financeData",
//                 select: "planName goalAmount createdAt",
//             })
//             .populate({
//                 path: "managedUsers.events",
//                 select: "eventName budget totalSpent remainingBudget",
//             });

//         if (!admin) {
//             return res.status(404).json({ message: "Admin not found" });
//         }

//         res.json(admin.managedUsers);
//     } catch (error) {
//         console.error("Error fetching managed users:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });


// module.exports = router;






const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminSchema');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT (For protected routes)
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        req.user = decoded;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admins only" });
        }

        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};

router.post('/register', async (req, res) => {  // ✅ No verifyToken middleware here
    const { adminName, email, password, passForUser } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const newAdmin = new Admin({
            adminName,
            email,
            password,  // Encrypt with bcrypt in production
            passForUser
        });

        await newAdmin.save();
        res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
});


// ✅ Protected Route: Get All Admins
router.get('/login', verifyToken, async (req, res) => {
    try {
        const allAdmins = await Admin.find();
        res.status(200).json(allAdmins);
    } catch (err) {
        res.status(500).send("Error fetching admins: " + err.message);
    }
});

router.get('/users', verifyToken, async (req, res) => {
    try {
        const adminId = req.user.id; // Extract admin ID from JWT

        // Find the admin and populate managed users
        const admin = await Admin.findById(adminId).populate('managedUsers.userId');

        if (!admin || admin.managedUsers.length === 0) {
            return res.status(404).json({ message: "No users found for this admin" });
        }

        res.status(200).json(admin.managedUsers);
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
});

module.exports = router;
