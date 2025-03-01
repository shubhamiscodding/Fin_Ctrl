// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// // Expense Schema
// const ExpenseSchema = new Schema({
//   date: { type: Date, required: true },
//   description: { type: String, required: true },
//   amount: { type: Number, required: true },
// });

// // Finance Plan Schema
// const FinancePlanSchema = new Schema({
//   planName: { type: String, required: true },
//   goalAmount: { type: Number, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// // Event Schema
// const EventSchema = new Schema({
//   eventName: { type: String, required: true },
//   budget: { type: Number, required: true },
//   expenses: { type: [ExpenseSchema], default: [] },
//   totalSpent: { type: Number, default: 0 },
//   remainingBudget: { type: Number, default: function() { return this.budget; } }, 
// });

// // Auto-update totalSpent and remainingBudget
// EventSchema.pre("save", function (next) {
//   this.totalSpent = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
//   this.remainingBudget = this.budget - this.totalSpent;
//   next();
// });

// // Managed Users Schema (Reference Instead of Embedded)
// const ManagedUserSchema = new Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   financeData: [{ type: mongoose.Schema.Types.ObjectId, ref: "FinancePlan" }], // Reference instead of embedding
//   events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], 
// });

// // Admin Schema
// const AdminSchema = new Schema(
//   {
//     adminName: { type: String, required: true },
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     password: { type: String, required: true },
//     managedUsers: { type: [ManagedUserSchema], default: [] },
//     passForUser: { type: String, required: true }, // Consider encrypting this
//   },
//   { timestamps: true }
// );

// // Indexes for fast queries
// AdminSchema.index({ email: 1 });
// ManagedUserSchema.index({ userId: 1 });

// // Admin Model
// const Admin = mongoose.model("Admin", AdminSchema);
// module.exports = Admin;




const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

// Expense Schema
const ExpenseSchema = new Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
});

// Finance Plan Schema
const FinancePlanSchema = new Schema({
  planName: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Event Schema
const EventSchema = new Schema({
  event_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }],
  // eventName: { type: String, required: true },
  // budget: { type: Number, required: true },
  // expenses: { type: [ExpenseSchema], default: [] },
  // totalSpent: { type: Number, default: 0 },
  // remainingBudget: {
  //   type: Number,
  //   default: function () {
  //     return this.budget;
  //   },
  // },
});

// Auto-update totalSpent and remainingBudget
EventSchema.pre("save", function (next) {
  this.totalSpent = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  this.remainingBudget = this.budget - this.totalSpent;
  next();
});

// Managed Users Schema (Reference Instead of Embedded)
const ManagedUserSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  financeData: [{ type: mongoose.Schema.Types.ObjectId, ref: "FinancePlan" }],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
});

// Admin Schema
const AdminSchema = new Schema(
  {
    adminName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    managedUsers: { type: [ManagedUserSchema], default: [] },
    passForUser: { type: String, required: true }, // Consider encrypting this
    events: [{ type: [EventSchema], default:[] }], // Reference instead of embedding
    // financeData: [{ type: mongoose.Schema.Types.ObjectId, ref: "FinancePlan" }], // Reference instead of embedding
  },
  { timestamps: true }
);

// 🔒 Hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare password method
AdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Generate JWT token
AdminSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Indexes for fast queries
AdminSchema.index({ email: 1 });
ManagedUserSchema.index({ userId: 1 });

// Admin Model
const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
