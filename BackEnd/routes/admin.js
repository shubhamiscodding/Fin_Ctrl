const express = require('express');
const { MongoClient } = require('mongodb');

const router = express.Router();

const url = 'mongodb+srv://shubhammodicg:9099@cluster1.zi1vg.mongodb.net/';
const dbName = "login-detail";

let db, admin;

async function connectDB() {
    try {
        const client = new MongoClient(url);
        await client.connect();
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        admin = db.collection("admin");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}
connectDB();

router.get('/admins', async (req, res) => {
    try {
        const alladmins = await admin.find().toArray();
        res.status(200).json(alladmins);
    } catch (err) {
        res.status(500).send("Error fetching admins: " + err.message);
    }
});

router.post('/admins', async (req, res) => {
    try {
        const newadmin = req.body;
        const result = await admin.insertOne(newadmin);
        res.status(201).send(`Admin added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding admin: " + err.message);
    }
});

router.put('/admins/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const updatedData = req.body;
        const result = await admin.updateOne({ name }, { $set: updatedData });
        if (result.matchedCount === 0) {
            return res.status(404).send("Admin not found");
        }
        res.status(200).send("Admin updated successfully");
    } catch (err) {
        res.status(500).send("Error updating admin: " + err.message);
    }
});

router.delete('admins/:user', async (req,res) => {
    try {
        const { user } = req.params;
        const result = await admin.deelteOne({ user });
        res.status(200).send("Admin updated successfully");
    } catch (err) {
        res.status(500).send("Error updating admin: " + err.message);
    }
})

module.exports = router;
