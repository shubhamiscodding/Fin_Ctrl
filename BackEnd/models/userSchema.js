const mongoose = require("mongoose");
const Admin = require("./adminSchema");

const Schema = mongoose.Schema;

const EventSchema = new Schema({
  eventName: { type: String, required: true },
  budget: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const FinancePlanSchema = new Schema({
  planName: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  events: { type: [EventSchema], default: [] },
  financePlans: { type: [FinancePlanSchema], default: [] },
  adminname: { type: String, required: true },
  passforuser: { type: String, required: true },
});

UserSchema.post("save", async function (doc) {
  try {
    const admin = await Admin.findOne({ adminname: doc.adminname });

    if (admin) {
      const isUserAlreadyManaged = admin.managedusers.some((user) =>
        user.userId.equals(doc._id)  // Use userId in comparison
      );

      if (!isUserAlreadyManaged) {
        admin.managedusers.push({
          userId: doc._id,  // Corrected to use `userId`
          events: doc.events,
          financeData: doc.financePlans,
        });

        admin.markModified('managedusers'); // Ensure this field is saved after update
        await admin.save();
        console.log(`User ${doc.username} added to managedusers of Admin: ${admin.adminname}`);
      } else {
        console.log(`User ${doc.username} is already managed by Admin: ${admin.adminname}`);
      }
    } else {
      console.log(`Admin with adminname ${doc.adminname} not found.`);
    }
  } catch (error) {
    console.error("Error updating managed users:", error);
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
