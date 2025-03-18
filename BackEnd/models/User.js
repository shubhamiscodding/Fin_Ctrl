const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const ManagedUserSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const UserSchema = new Schema(
  {
    username: { type: String }, // Optional for users
    adminName: { type: String }, // Optional for admins
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    financePlans: [{ type: mongoose.Schema.Types.ObjectId, ref: "FinancePlan", default: [] }],
    assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    managedUsers: { type: [ManagedUserSchema], default: [] }, // Added from Admin
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      username: this.username,
      adminName: this.adminName,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

UserSchema.methods.addManagedUser = async function (userId) {
  if (!this.managedUsers.some((user) => user.userId.equals(userId))) {
    this.managedUsers.push({ userId });
    await this.save();
  }
};

UserSchema.index({ email: 1 });
ManagedUserSchema.index({ userId: 1 });

// ✅ FIX: Prevent Model Overwriting
const User = mongoose.models.User || mongoose.model("User", UserSchema);
module.exports = User;
