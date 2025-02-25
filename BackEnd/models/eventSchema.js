const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Expense Schema
const ExpenseSchema = new Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
});

// Event Schema
const EventSchema = new Schema(
  {
    eventName: { type: String, required: true },
    budget: { type: Number, default: 0 }, // Set default to 0
    expenses: { type: [ExpenseSchema], default: [] },
    totalSpent: { type: Number, default: 0 },
    remainingBudget: { type: Number, default: 0 },
    description: { type: String, default: "N/A" },
    dateofevent: { type: Date, default: Date.now, require:true },
    ispublic: { type: Boolean, default: false }, 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Pre-save hook to update totalSpent and remainingBudget
EventSchema.pre("save", function (next) {
  this.totalSpent = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  this.remainingBudget = this.budget - this.totalSpent;
  next();
});

// Indexes for performance
EventSchema.index({ createdBy: 1 });
EventSchema.index({ eventId: 1 });

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
