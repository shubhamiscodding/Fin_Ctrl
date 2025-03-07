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
    expiresIn: "7d",
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