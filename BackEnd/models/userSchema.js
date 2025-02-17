const mongoose = require("mongoose");
const Admin = require("./adminSchema");

const Schema = mongoose.Schema;

// Event Schema
const EventSchema = new Schema({
  eventName: { type: String, required: true },
  budget: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Finance Plan Schema
const FinancePlanSchema = new Schema({
  planName: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// User Schema
const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // Encrypt this with bcrypt
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], // References instead of embedded data
    financePlans: [{ type: mongoose.Schema.Types.ObjectId, ref: "FinancePlan" }], // References
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // Direct admin reference
  },
  { timestamps: true }
);

// After user creation, add them to the respective Admin's managed users
UserSchema.post("save", async function (doc) {
  try {
    const admin = await Admin.findById(doc.admin);

    if (admin) {
      const isUserAlreadyManaged = admin.managedUsers.some((user) =>
        user.userId.equals(doc._id)
      );

      if (!isUserAlreadyManaged) {
        admin.managedUsers.push({ userId: doc._id });
        await admin.save();
        console.log(`User ${doc.username} added to Admin: ${admin.adminname}`);
      }
    } else {
      console.log(`Admin with ID ${doc.admin} not found.`);
    }
  } catch (error) {
    console.error("Error updating managed users:", error);
  }
});

// Indexes for performance
UserSchema.index({ email: 1 });

// User Model
const User = mongoose.model("User", UserSchema);
module.exports = User;
