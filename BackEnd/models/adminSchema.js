const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
});

const FinancePlanSchema = new Schema({
  planName: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});


const EventSchema = new Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, required: true },
  eventName: { type: String, required: true },
  budget: { type: Number, required: true },
  expenses: { type: [ExpenseSchema], default: [] },
  totalSpent: { type: Number, default: 0 },
  remainingBudget: { type: Number, default: 0 },
});

const ManagedusersSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Change this to `userId`
  financeData: { type: [FinancePlanSchema], default: [] },
  events: { type: [EventSchema], default: [] },
});

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
  { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
