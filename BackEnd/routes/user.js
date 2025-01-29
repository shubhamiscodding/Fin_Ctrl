const express = require('express');
const { MongoClient } = require('mongodb');

const router = express.Router();

const url = 'mongodb+srv://shubhammodicg:9099@cluster1.zi1vg.mongodb.net/';
const dbName = "login-detail";

let db, user;

async function connectDB() {
    try {
        const client = new MongoClient(url);
        await client.connect();
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        user = db.collection("user");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}
connectDB();

router.get('/', async (req, res) => {
    try {
        const allUsers = await user.find().toArray();
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).send("Error fetching users: " + err.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const newUser = req.body;
        const result = await user.insertOne(newUser);
        res.status(201).send(`User added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding user: " + err.message);
    }
});

router.put('/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const updatedData = req.body;
        const result = await user.updateOne({ name }, { $set: updatedData });
        if (result.matchedCount === 0) {
            return res.status(404).send("User not found");
        }
        res.status(200).send("User updated successfully");
    } catch (err) {
        res.status(500).send("Error updating user: " + err.message);
    }
});

module.exports = router;


