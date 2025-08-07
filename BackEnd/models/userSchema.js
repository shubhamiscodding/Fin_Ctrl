const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  adminName: { type: String, required: true },
  passForUser: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  financePlans: [{ type: mongoose.Schema.Types.ObjectId, ref: "FinancePlan" }],

  // ✅ FIXED: use ObjectId reference for admin
  assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }

}, { timestamps: true });

// 🔐 Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔐 Method to compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// 🔐 JWT token generator
UserSchema.methods.generateAuthToken = function () {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign({ id: this._id, role: this.role, username: this.username }, secret, { expiresIn: '7d' });
};

// 📌 Ensure unique index on email
UserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
