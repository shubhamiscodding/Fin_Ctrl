const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Expense Schema
const ExpenseSchema = new Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },  // Adding category for better expense classification
});

// Finance Plan Schema
const FinancePlanSchema = new Schema({
  planName: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  totalSaved: { type: Number, default: 0 }, // Total amount saved towards the plan
  remainingAmount: { type: Number, default: 0 }, // Remaining amount to reach the goal
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Finance Schema
const FinanceSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" }, // Optional if the finance is related to an event
    financePlans: { type: [FinancePlanSchema], default: [] }, // List of finance plans associated with the user
    expenses: { type: [ExpenseSchema], default: [] }, // List of expenses associated with the user
    totalSpent: { type: Number, default: 0 }, // Total spent across all expenses
    totalSaved: { type: Number, default: 0 }, // Total saved across all finance plans
    remainingBudget: { type: Number, default: 0 }, // Remaining budget (calculated dynamically)
    isPublic: { type: Boolean, default: false }, // Whether the user's financial data is public
  },
  { timestamps: true }
);

// Pre-save hook to update totalSpent and remainingBudget
FinanceSchema.pre("save", function (next) {
  this.totalSpent = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  this.totalSaved = this.financePlans.reduce((sum, plan) => sum + plan.totalSaved, 0);
  this.remainingBudget = this.totalSaved - this.totalSpent;
  next();
});

// Indexes for performance
FinanceSchema.index({ userId: 1 });
FinanceSchema.index({ eventId: 1 });

const Finance = mongoose.model("Finance", FinanceSchema);

module.exports = Finance;
