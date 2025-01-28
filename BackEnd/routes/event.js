
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const Event = require('../models/eventSchema');

const app = express();
const port = 3000;


const url = 'mongodb+srv://shubhammodicg:9099@cluster1.zi1vg.mongodb.net/';
const dbName = "login-detail";

app.use(express.json());
app.use(cors());

let db, event;

async function main() {
    try {
        const client = new MongoClient(url); // No need for useUnifiedTopology
        client.connect();
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        event = db.collection("event");

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}

main();

app.get('/events', async (req, res) => {
    try {
        const allevents = await event.find().toArray();
        res.status(200).json(allevents);
    } catch (err) {
        res.status(500).send("Error fetching events: " + err.message);
    }
});

app.post('/events', async (req, res) => {
    try {
        const newevent = req.body;
        const result = await event.insertOne(newevent);
        res.status(201).send(`event added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding event: " + err.message);
    }
});

app.put('/events/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const updatedData = req.body;
        const result = await event.updateOne({ name }, { $set: updatedData });
        if (result.matchedCount === 0) {
            return res.status(404).send("event not found");
        }
        res.status(200).send("event updated successfully");
    } catch (err) {
        res.status(500).send("Error updating event: " + err.message);
    }
});



