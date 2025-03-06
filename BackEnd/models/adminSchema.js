// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const Schema = mongoose.Schema;

// // ✅ Expense Schema
// const ExpenseSchema = new Schema({
//   date: { type: Date, required: true },
//   description: { type: String, required: true },
//   amount: { type: Number, required: true, min: 0 },
// });

// // ✅ Finance Plan Schema
// const FinancePlanSchema = new Schema({
//   planName: { type: String, required: true },
//   goalAmount: { type: Number, required: true, min: 0 },
//   createdAt: { type: Date, default: Date.now },
// });

// // ✅ Event Schema
// const EventSchema = new Schema({
//   eventName: { type: String, required: true },
//   budget: { type: Number, required: true, min: 0 },
//   expenses: { type: [ExpenseSchema], default: [] },
//   totalSpent: { type: Number, default: 0 },
//   remainingBudget: { type: Number, default: 0 }, // Remove function-based default
// });

// // 🔄 Auto-update `totalSpent` and `remainingBudget`
// EventSchema.pre("save", function (next) {
//   this.totalSpent = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
//   this.remainingBudget = this.budget - this.totalSpent;
//   next();
// });

// // ✅ Managed Users Schema
// const ManagedUserSchema = new Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   financeData: [{ type: mongoose.Schema.Types.ObjectId, ref: "FinancePlan" }],
//   events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
// });

// // ✅ Admin Schema
// const AdminSchema = new Schema(
//   {
//     adminName: { type: String, required: true },
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     password: { type: String, required: true }, // Encrypted password
//     role: { type: String, enum: ["admin"], default: "admin" },
//     managedUsers: { type: [ManagedUserSchema], default: [] },
//     events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event", default: [] }]
//   },
//   { timestamps: true }
// );

// // 🔒 Hash password before saving
// AdminSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // ✅ Compare password method
// AdminSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // ✅ Generate JWT token
// AdminSchema.methods.generateAuthToken = function () {
//   return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
//     expiresIn: "1h",
//   });
// };

// // ✅ Method to Add a Managed User (Recommended for Better Data Integrity)
// AdminSchema.methods.addManagedUser = async function (userId) {
//   this.managedUsers.push({ userId });
//   await this.save();
// };

// // 📌 Indexes for faster queries
// AdminSchema.index({ email: 1 });
// ManagedUserSchema.index({ userId: 1 });

// const Admin = mongoose.model("Admin", AdminSchema);
// module.exports = Admin;











const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

// Managed Users Schema (Simplified)
const ManagedUserSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// Admin Schema
const AdminSchema = new Schema(
  {
    adminName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
    managedUsers: { type: [ManagedUserSchema], default: [] },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event", default: [] }],
  },
  { timestamps: true }
);

// Hash password
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
AdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
AdminSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Add managed user
AdminSchema.methods.addManagedUser = async function (userId) {
  if (!this.managedUsers.some((user) => user.userId.equals(userId))) {
    this.managedUsers.push({ userId });
    await this.save();
  }
};

// Indexes
AdminSchema.index({ email: 1 });
ManagedUserSchema.index({ userId: 1 });

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;