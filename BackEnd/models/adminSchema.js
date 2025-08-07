const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ManagedUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const AdminSchema = new mongoose.Schema({
  adminName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  passForUser: { type: String, required: true },
  role: { type: String, enum: ['admin'], default: 'admin' },
  managedUsers: [ManagedUserSchema],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
}, { timestamps: true });


AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

AdminSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

AdminSchema.methods.generateAuthToken = function () {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  console.log('Admin generating token with JWT_SECRET:', secret); // Debug
  return jwt.sign({ id: this._id, role: this.role, adminName: this.adminName }, secret, { expiresIn: '7d' });
};

AdminSchema.methods.addManagedUser = async function (userId) {
  if (!this.managedUsers.some((user) => user.userId.equals(userId))) {
    this.managedUsers.push({ userId });
    await this.save();
  }
};

AdminSchema.index({ email: 1 });
ManagedUserSchema.index({ userId: 1 });

module.exports = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);