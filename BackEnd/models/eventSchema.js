const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Expense Schema
const ExpenseSchema = new Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
});

// Event Schema
const EventSchema = new Schema(
  {
    eventName: { type: String, required: true },
    budget: { type: Number, default: 0, min: 0 },
    expenses: { type: [ExpenseSchema], default: [] },
    totalSpent: { type: Number, default: 0 },
    remainingBudget: { type: Number, default: 0 },
    description: { type: String, default: "N/A" },
    dateofevent: { type: Date, default: Date.now, required: true },
    ispublic: { type: Boolean, default: false, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel",
      required: true,
    },
    createdByModel: {
      type: String,
      required: true,
      enum: ["User", "Admin"],
    },
  },
  { timestamps: true }
);

// Update totalSpent and remainingBudget
EventSchema.pre("save", function (next) {
  this.totalSpent = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  this.remainingBudget = this.budget - this.totalSpent;
  next();
});

// Indexes
EventSchema.index({ createdBy: 1 });

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;