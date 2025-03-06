// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const Schema = mongoose.Schema;

// // Event Schema
// const EventSchema = new Schema({
//   eventName: { type: String, required: true },
//   budget: { type: Number, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// // Finance Plan Schema
// const FinancePlanSchema = new Schema({
//   planName: { type: String, required: true },
//   goalAmount: { type: Number, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// // User Schema
// const UserSchema = new Schema(
//   {
//     username: { type: String, required: true },
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     password: { type: String, required: true }, // Will be encrypted
//     role: { type: String, enum: ["user", "admin"], default: "user" }, // Added role field
//     events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
//     financePlans: [{ type: mongoose.Schema.Types.ObjectId, ref: "FinancePlan" }],
//     admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: false }, // Made optional
//   },
//   { timestamps: true }
// );

// // 🔒 Hash password before saving
// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // ✅ Compare password method
// UserSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // ✅ Generate JWT token
// UserSchema.methods.generateAuthToken = function () {
//   return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
//     expiresIn: "1h",
//   });
// };

// // After user creation, add them to the respective Admin's managed users (to prevent circular dependency)
// UserSchema.post("save", async function (doc) {
//   if (!doc.admin) return; // Only execute if admin exists

//   try {
//     const Admin = mongoose.model("Admin"); // Fetch Admin model dynamically
//     const admin = await Admin.findById(doc.admin);

//     if (admin) {
//       const isUserAlreadyManaged = admin.managedUsers.some((user) =>
//         user.userId.equals(doc._id)
//       );

//       if (!isUserAlreadyManaged) {
//         admin.managedUsers.push({ userId: doc._id });
//         await admin.save();
//         console.log(`User ${doc.username} added to Admin: ${admin.adminName}`);
//       }
//     } else {
//       console.log(`Admin with ID ${doc.admin} not found.`);
//     }
//   } catch (error) {
//     console.error("Error updating managed users:", error);
//   }
// });

// // Indexes for performance
// UserSchema.index({ email: 1 });

// const User = mongoose.model("User", UserSchema);
// module.exports = User;














const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    financePlans: [{ type: mongoose.Schema.Types.ObjectId, ref: "FinancePlan" }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: false },
  },
  { timestamps: true }
);

// Hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Indexes
UserSchema.index({ email: 1 });

const User = mongoose.model("User", UserSchema);
module.exports = User;