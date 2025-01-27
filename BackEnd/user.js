const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const url = 'mongodb://127.0.0.1:27017/';
const dbName = "login-detail";

app.use(express.json());
app.use(cors());

let db, user;

async function main() {
    try {
        const client = new MongoClient(url); // No need for useUnifiedTopology
        client.connect();
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        user = db.collection("user");

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}

main();

app.get('/users', async (req, res) => {
    try {
        const allUsers = await user.find().toArray();
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).send("Error fetching users: " + err.message);
    }
});

app.post('/users', async (req, res) => {
    try {
        const newUser = req.body;
        const result = await user.insertOne(newUser);
        res.status(201).send(`User added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding user: " + err.message);
    }
});

app.put('/users/:name', async (req, res) => {
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



const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Sub-schema for events
const EventSchema = new Schema({
  eventName: { type: String, required: true },
  budget: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Sub-schema for finance plans
const FinancePlanSchema = new Schema({
  planName: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Main schema for user data
const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  events: { type: [EventSchema], default: [] },
  financePlans: { type: [FinancePlanSchema], default: [] },
  adminname: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
