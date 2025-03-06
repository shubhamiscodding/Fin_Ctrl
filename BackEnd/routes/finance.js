require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Finance = require("../models/financeSchema");
const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");

const router = express.Router();

// Middleware to verify JWT (Should be extracted to middleware/auth.js)
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }
  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// CREATE a finance record (Both Admins and Users)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { eventId, financePlans, expenses, isPublic } = req.body;
    const creatorId = req.user.id;
    const role = req.user.role;

    const newFinance = new Finance({
      createdBy: creatorId,
      createdByModel: role === "admin" ? "Admin" : "User",
      eventId: eventId || null,
      financePlans: financePlans || [],
      expenses: expenses || [],
      isPublic: isPublic !== undefined ? isPublic : false,
    });

    const savedFinance = await newFinance.save();
    res.status(201).json({ message: "Finance record created successfully", finance: savedFinance });
  } catch (err) {
    console.error("Error creating finance record:", err.stack);
    res.status(500).json({ message: "Error creating finance record: " + err.message });
  }
});

// GET all finance records (Admins see all, Users see their own)
router.get("/", verifyToken, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "admin") {
      // Admins see all finance records
    } else {
      // Users see only their own
      query.createdBy = req.user.id;
      query.createdByModel = "User";
    }

    const finances = await Finance.find(query).populate("eventId").sort({ updatedAt: -1 });
    res.status(200).json(finances);
  } catch (err) {
    console.error("Error fetching finance records:", err.stack);
    res.status(500).json({ message: "Error fetching finance records: " + err.message });
  }
});

// GET finance records by time period (month, week, or custom range)
router.get("/period", verifyToken, async (req, res) => {
  try {
    const { period, year, month, week, startDate, endDate } = req.query;
    let query = {};

    if (req.user.role !== "admin") {
      query.createdBy = req.user.id;
      query.createdByModel = "User";
    }

    // Handle different time period filters
    if (period === "month" && year && month) {
      // Fetch data for a specific month
      const start = new Date(year, month - 1, 1); // Month is 0-indexed
      const end = new Date(year, month, 0); // Last day of the month
      query["expenses.date"] = { $gte: start, $lte: end };
    } else if (period === "week" && year && week) {
      // Fetch data for a specific week
      const start = new Date(year);
      start.setDate(start.getDate() - start.getDay() + (week - 1) * 7); // Start of week
      const end = new Date(start);
      end.setDate(end.getDate() + 6); // End of week
      query["expenses.date"] = { $gte: start, $lte: end };
    } else if (startDate && endDate) {
      // Custom date range
      query["expenses.date"] = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else {
      return res.status(400).json({ message: "Invalid period parameters. Use month (year, month), week (year, week), or custom (startDate, endDate)" });
    }

    const finances = await Finance.find(query)
      .populate("eventId")
      .sort({ "expenses.date": -1 });

    if (finances.length === 0) {
      return res.status(404).json({ message: "No finance records found for this period" });
    }

    res.status(200).json(finances);
  } catch (err) {
    console.error("Error fetching finance records by period:", err.stack);
    res.status(500).json({ message: "Error fetching finance records: " + err.message });
  }
});

// ADD an expense to a finance record
router.post("/:id/expenses", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, description, amount, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Finance ID" });
    }

    const finance = await Finance.findById(id);
    if (!finance) {
      return res.status(404).json({ message: "Finance record not found" });
    }

    // Check permissions
    if (req.user.role !== "admin" && finance.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to modify this finance record" });
    }

    // Validate expense data
    if (!date || !description || !amount || !category) {
      return res.status(400).json({ message: "Date, description, amount, and category are required" });
    }

    finance.expenses.push({ date: new Date(date), description, amount: Number(amount), category });
    const updatedFinance = await finance.save();

    res.status(200).json({ message: "Expense added successfully", finance: updatedFinance });
  } catch (err) {
    console.error("Error adding expense:", err.stack);
    res.status(500).json({ message: "Error adding expense: " + err.message });
  }
});

// ADD savings to a finance plan
router.post("/:id/plan/:planId/savings", verifyToken, async (req, res) => {
  try {
    const { id, planId } = req.params;
    const { amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({ message: "Invalid Finance or Plan ID" });
    }

    const finance = await Finance.findById(id);
    if (!finance) {
      return res.status(404).json({ message: "Finance record not found" });
    }

    // Check permissions
    if (req.user.role !== "admin" && finance.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to modify this finance record" });
    }

    const plan = finance.financePlans.id(planId);
    if (!plan) {
      return res.status(404).json({ message: "Finance plan not found" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid savings amount is required" });
    }

    plan.totalSaved += Number(amount);
    const updatedFinance = await finance.save();

    res.status(200).json({ message: "Savings added successfully", finance: updatedFinance });
  } catch (err) {
    console.error("Error adding savings:", err.stack);
    res.status(500).json({ message: "Error adding savings: " + err.message });
  }
});

// DELETE a finance record
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Finance ID" });
    }

    const finance = await Finance.findById(id);
    if (!finance) {
      return res.status(404).json({ message: "Finance record not found" });
    }

    // Check permissions
    if (req.user.role !== "admin" && finance.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this finance record" });
    }

    await Finance.findByIdAndDelete(id);
    res.status(200).json({ message: "Finance record deleted successfully" });
  } catch (err) {
    console.error("Error deleting finance record:", err.stack);
    res.status(500).json({ message: "Error deleting finance record: " + err.message });
  }
});

module.exports = router;