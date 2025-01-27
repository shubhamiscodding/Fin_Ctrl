
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const url = 'mongodb://127.0.0.1:27017/';
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





const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Sub-schema for entries in finance trackers
const EntrySchema = new Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
});

// Sub-schema for finance trackers
const FinanceTrackerSchema = new Schema({
  trackerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  trackerName: { type: String, required: true },
  entries: { type: [EntrySchema], default: [] },
  totalBalance: { type: Number, default: 0 },
});

// Sub-schema for expenses in events
const ExpenseSchema = new Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
});

// Sub-schema for events
const EventSchema = new Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, required: true },
  eventName: { type: String, required: true },
  budget: { type: Number, required: true },
  expenses: { type: [ExpenseSchema], default: [] },
  totalSpent: { type: Number, default: 0 },
  remainingBudget: { type: Number, default: 0 },
});

// Sub-schema for managed admins
const ManagedusersSchema = new Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, required: true },
  financeData: { type: [FinanceTrackerSchema], default: [] },
  events: { type: [EventSchema], default: [] },
});

// Main schema
const AdminSchema = new Schema(
  {
    adminname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    managedusers: { type: [ManagedusersSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    passforuser: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
