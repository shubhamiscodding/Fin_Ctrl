const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const ExpenseSchema = new Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
});

const EventSchema = new Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId },
    eventName: { type: String, required: true },
    budget: { type: Number },
    expenses: { type: [ExpenseSchema], default: [] },
    totalSpent: { type: Number, default: 0 },
    remainingBudget: { type: Number, default: 0 },
    description: { type: String, default: "N/A" },
    dateOfEvent: { type: Date, default: Date.now },
    isPublic: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } ,
    status : { type: Boolean, default:true},
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
