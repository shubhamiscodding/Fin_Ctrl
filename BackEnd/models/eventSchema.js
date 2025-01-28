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