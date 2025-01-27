
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const url = 'mongodb://127.0.0.1:27017/';
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















const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Sub-schema for event expenses
const ExpenseSchema = new Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
});

// Main schema for the event
const EventSchema = new Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, required: true },
    eventName: { type: String, required: true },
    budget: { type: Number, required: true },
    expenses: { type: [ExpenseSchema], default: [] },
    totalSpent: { type: Number, default: 0 },
    remainingBudget: { type: Number, default: 0 },
    discription: { type: String, default: "N/A" },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
