
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const Admin = require('../models/adminSchema');

const app = express();
const port = 3000;

const url = 'mongodb+srv://shubhammodicg:9099@cluster1.zi1vg.mongodb.net/';
const dbName = "login-detail";

app.use(express.json());
app.use(cors());

let db, admin;

async function main() {
    try {
        const client = new MongoClient(url); // No need for useUnifiedTopology
        client.connect();
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        admin = db.collection("admin");

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}

main();

app.get('/admins', async (req, res) => {
    try {
        const alladmins = await admin.find().toArray();
        res.status(200).json(alladmins);
    } catch (err) {
        res.status(500).send("Error fetching admins: " + err.message);
    }
});

app.post('/admins', async (req, res) => {
    try {
        const newadmin = req.body;
        const result = await admin.insertOne(newadmin);
        res.status(201).send(`admin added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding admin: " + err.message);
    }
});

app.put('/admins/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const updatedData = req.body;
        const result = await admin.updateOne({ name }, { $set: updatedData });
        if (result.matchedCount === 0) {
            return res.status(404).send("admin not found");
        }
        res.status(200).send("admin updated successfully");
    } catch (err) {
        res.status(500).send("Error updating admin: " + err.message);
    }
});





