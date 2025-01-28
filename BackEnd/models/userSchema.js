const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Sub-schema for events
const EventSchema = new Schema({
  eventName: { type: String, required: true },
  budget: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Sub-schema for finance plans
const FinancePlanSchema = new Schema({
  planName: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Main schema for user data
const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  events: { type: [EventSchema], default: [] },
  financePlans: { type: [FinancePlanSchema], default: [] },
  adminname: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
