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
