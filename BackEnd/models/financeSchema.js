const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Expense Schema
const ExpenseSchema = new Schema({
  date: { type: Date, required: true, index: true }, // Index for time-based queries
  description: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    required: true,
    enum: ["Food", "Transport", "Entertainment", "Bills", "Other"], // Predefined categories (customize as needed)
    default: "Other",
  },
});

// Savings Transaction Schema (New)
const SavingsTransactionSchema = new Schema({
  date: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, default: "Savings contribution" },
});

// Finance Plan Schema
const FinancePlanSchema = new Schema({
  planName: { type: String, required: true },
  goalAmount: { type: Number, required: true, min: 0 },
  totalSaved: { type: Number, default: 0, min: 0 },
  remainingAmount: { type: Number, default: 0 },
  savingsTransactions: { type: [SavingsTransactionSchema], default: [] }, // Track individual savings
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Finance Schema
const FinanceSchema = new Schema(
  {
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
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: false },
    financePlans: { type: [FinancePlanSchema], default: [] },
    expenses: { type: [ExpenseSchema], default: [] },
    totalSpent: { type: Number, default: 0, min: 0 },
    totalSaved: { type: Number, default: 0, min: 0 },
    remainingBudget: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Pre-save hook to update totals and remaining budget
FinanceSchema.pre("save", async function (next) {
  try {
    // Calculate total spent from expenses
    this.totalSpent = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate total saved from finance plans and update remainingAmount
    this.totalSaved = this.financePlans.reduce((sum, plan) => {
      plan.totalSaved = plan.savingsTransactions.reduce((total, tx) => total + tx.amount, 0);
      plan.remainingAmount = plan.goalAmount - plan.totalSaved;
      plan.updatedAt = Date.now();
      return sum + plan.totalSaved;
    }, 0);

    // Remaining budget logic
    this.remainingBudget = this.totalSaved - this.totalSpent;

    // Optional: Event-based remaining budget (uncomment if needed)
    // if (this.eventId) {
    //   const Event = mongoose.model("Event");
    //   const event = await Event.findById(this.eventId);
    //   if (event) {
    //     this.remainingBudget = event.budget - this.totalSpent;
    //   }
    // }

    next();
  } catch (err) {
    next(err);
  }
});

// Indexes for performance
FinanceSchema.index({ createdBy: 1 });
FinanceSchema.index({ eventId: 1 });
FinanceSchema.index({ "expenses.date": 1 }); // Compound index for time-based queries

const Finance = mongoose.model("Finance", FinanceSchema);
module.exports = Finance;