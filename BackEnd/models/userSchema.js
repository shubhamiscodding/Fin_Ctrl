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
  assignedAdmin: { type: String, ref: "Admin", required: true },  // Changed to use adminName (String) instead of ObjectId
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateAuthToken = function () {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  console.log('User generating token with JWT_SECRET:', secret); // Debug
  return jwt.sign({ id: this._id, role: this.role, username: this.username }, secret, { expiresIn: '7d' });
};

UserSchema.index({ email: 1 });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);