require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Finance = require("../models/financeSchema");

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }
  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
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
    res
      .status(201)
      .json({
        message: "Finance record created successfully",
        finance: savedFinance,
      });
  } catch (err) {
    console.error("Error creating finance record:", err.stack);
    res
      .status(500)
      .json({ message: "Error creating finance record: " + err.message });
  }
});

// Add or update finance record for today
router.post("/today", verifyToken, async (req, res) => {
  try {
    const { type, amount, description, category } = req.body; // type: "expense" or "income"
    const creatorId = req.user.id;
    const role = req.user.role;

    if (
      !type ||
      !["expense", "income"].includes(type) ||
      !amount ||
      amount <= 0
    ) {
      return res
        .status(400)
        .json({
          message: "Valid type (expense/income) and amount are required",
        });
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    let finance =
      (await Finance.findOne({
        createdBy: creatorId,
        createdByModel: role === "admin" ? "Admin" : "User",
        "expenses.date": { $gte: startOfDay, $lte: endOfDay },
      })) ||
      (await Finance.findOne({
        createdBy: creatorId,
        createdByModel: role === "admin" ? "Admin" : "User",
        "financePlans.savingsTransactions.date": {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      }));

    if (!finance) {
      finance = new Finance({
        createdBy: creatorId,
        createdByModel: role === "admin" ? "Admin" : "User",
        financePlans:
          type === "income"
            ? [
                {
                  planName: "Daily Savings",
                  goalAmount: 0,
                  savingsTransactions: [
                    {
                      date: new Date(),
                      amount: Number(amount),
                      description: description || "Daily Income",
                    },
                  ],
                },
              ]
            : [],
        expenses:
          type === "expense"
            ? [
                {
                  date: new Date(),
                  description: description || "Daily Expense",
                  amount: Number(amount),
                  category: category || "Other",
                },
              ]
            : [],
        isPublic: false,
      });
    } else {
      if (type === "expense") {
        finance.expenses.push({
          date: new Date(),
          description: description || "Daily Expense",
          amount: Number(amount),
          category: category || "Other",
        });
      } else if (type === "income") {
        let plan = finance.financePlans[0];
        if (!plan) {
          plan = {
            planName: "Daily Savings",
            goalAmount: 0,
            savingsTransactions: [],
          };
          finance.financePlans.push(plan);
        }
        plan.savingsTransactions.push({
          date: new Date(),
          amount: Number(amount),
          description: description || "Daily Income",
        });
      }
    }

    const updatedFinance = await finance.save();
    res
      .status(200)
      .json({ message: `${type} added successfully`, finance: updatedFinance });
  } catch (err) {
    console.error("Error adding to today’s finance:", err.stack);
    res
      .status(500)
      .json({ message: "Error adding to today’s finance: " + err.message });
  }
});

// Add or update finance record for a specific date
router.post("/date", verifyToken, async (req, res) => {
  try {
    const { type, amount, description, category, date } = req.body; // date in "YYYY-MM-DD" format
    const creatorId = req.user.id;
    const role = req.user.role;

    if (
      !type ||
      !["expense", "income"].includes(type) ||
      !amount ||
      amount <= 0 ||
      !date
    ) {
      return res
        .status(400)
        .json({
          message: "Valid type (expense/income), amount, and date are required",
        });
    }

    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid date format, use YYYY-MM-DD" });
    }

    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    let finance =
      (await Finance.findOne({
        createdBy: creatorId,
        createdByModel: role === "admin" ? "Admin" : "User",
        "expenses.date": { $gte: startOfDay, $lte: endOfDay },
      })) ||
      (await Finance.findOne({
        createdBy: creatorId,
        createdByModel: role === "admin" ? "Admin" : "User",
        "financePlans.savingsTransactions.date": {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      }));

    if (!finance) {
      finance = new Finance({
        createdBy: creatorId,
        createdByModel: role === "admin" ? "Admin" : "User",
        financePlans:
          type === "income"
            ? [
                {
                  planName: "Daily Savings",
                  goalAmount: 0,
                  savingsTransactions: [
                    {
                      date: targetDate,
                      amount: Number(amount),
                      description: description || "Income",
                    },
                  ],
                },
              ]
            : [],
        expenses:
          type === "expense"
            ? [
                {
                  date: targetDate,
                  description: description || "Expense",
                  amount: Number(amount),
                  category: category || "Other",
                },
              ]
            : [],
        isPublic: false,
      });
    } else {
      if (type === "expense") {
        finance.expenses.push({
          date: targetDate,
          description: description || "Expense",
          amount: Number(amount),
          category: category || "Other",
        });
      } else if (type === "income") {
        let plan = finance.financePlans[0];
        if (!plan) {
          plan = {
            planName: "Daily Savings",
            goalAmount: 0,
            savingsTransactions: [],
          };
          finance.financePlans.push(plan);
        }
        plan.savingsTransactions.push({
          date: targetDate,
          amount: Number(amount),
          description: description || "Income",
        });
      }
    }

    const updatedFinance = await finance.save();
    res
      .status(200)
      .json({
        message: `${type} added successfully for ${date}`,
        finance: updatedFinance,
      });
  } catch (err) {
    console.error("Error adding to specific date’s finance:", err.stack);
    res
      .status(500)
      .json({
        message: "Error adding to specific date’s finance: " + err.message,
      });
  }
});

// GET all finance records (Admins see all, Users see their own) with optional day filter
router.get("/", verifyToken, async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};

    if (req.user.role === "admin") {
      // Admins see all finance records
    } else {
      query.createdBy = req.user.id;
      query.createdByModel = "User";
    }

    const finances = await Finance.find(query)
      .populate("eventId")
      .sort({ updatedAt: -1 });

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const filteredFinances = finances
        .map((finance) => {
          const filteredExpenses = finance.expenses.filter(
            (exp) => exp.date >= startOfDay && exp.date <= endOfDay
          );
          const filteredPlans = finance.financePlans
            .map((plan) => ({
              ...plan._doc,
              savingsTransactions: plan.savingsTransactions.filter(
                (tx) => tx.date >= startOfDay && tx.date <= endOfDay
              ),
            }))
            .filter(
              (plan) =>
                plan.savingsTransactions.length > 0 || plan.totalSaved > 0
            );

          return {
            ...finance._doc,
            expenses: filteredExpenses,
            financePlans: filteredPlans,
          };
        })
        .filter(
          (finance) =>
            finance.expenses.length > 0 || finance.financePlans.length > 0
        );

      return res.status(200).json(filteredFinances);
    }

    res.status(200).json(finances);
  } catch (err) {
    console.error("Error fetching finance records:", err.stack);
    res
      .status(500)
      .json({ message: "Error fetching finance records: " + err.message });
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

    if (period === "month" && year && month) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      query["expenses.date"] = { $gte: start, $lte: end };
    } else if (period === "week" && year && week) {
      const start = new Date(year);
      start.setDate(start.getDate() - start.getDay() + (week - 1) * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      query["expenses.date"] = { $gte: start, $lte: end };
    } else if (startDate && endDate) {
      query["expenses.date"] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      return res.status(400).json({ message: "Invalid period parameters" });
    }

    const finances = await Finance.find(query)
      .populate("eventId")
      .sort({ "expenses.date": -1 });

    if (finances.length === 0) {
      return res
        .status(404)
        .json({ message: "No finance records found for this period" });
    }

    res.status(200).json(finances);
  } catch (err) {
    console.error("Error fetching finance records by period:", err.stack);
    res
      .status(500)
      .json({ message: "Error fetching finance records: " + err.message });
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

    if (
      req.user.role !== "admin" &&
      finance.createdBy.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to modify this finance record" });
    }

    if (!date || !description || !amount || !category) {
      return res
        .status(400)
        .json({
          message: "Date, description, amount, and category are required",
        });
    }

    finance.expenses.push({
      date: new Date(date),
      description,
      amount: Number(amount),
      category,
    });
    const updatedFinance = await finance.save();

    res
      .status(200)
      .json({ message: "Expense added successfully", finance: updatedFinance });
  } catch (err) {
    console.error("Error adding expense:", err.stack);
    res.status(500).json({ message: "Error adding expense: " + err.message });
  }
});

// ADD savings to a finance plan
router.post("/:id/plan/:planId/savings", verifyToken, async (req, res) => {
  try {
    const { id, planId } = req.params;
    const { amount, date, description } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(planId)
    ) {
      return res.status(400).json({ message: "Invalid Finance or Plan ID" });
    }

    const finance = await Finance.findById(id);
    if (!finance) {
      return res.status(404).json({ message: "Finance record not found" });
    }

    if (
      req.user.role !== "admin" &&
      finance.createdBy.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to modify this finance record" });
    }

    const plan = finance.financePlans.id(planId);
    if (!plan) {
      return res.status(404).json({ message: "Finance plan not found" });
    }

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Valid savings amount is required" });
    }

    plan.savingsTransactions.push({
      date: date || Date.now(),
      amount: Number(amount),
      description: description || "Savings contribution",
    });
    const updatedFinance = await finance.save();

    res
      .status(200)
      .json({ message: "Savings added successfully", finance: updatedFinance });
  } catch (err) {
    console.error("Error adding savings:", err.stack);
    res.status(500).json({ message: "Error adding savings: " + err.message });
  }
});

// UPDATE a finance record
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { expenses, savingsTransactions } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Finance ID" });
    }

    const finance = await Finance.findById(id);
    if (!finance) {
      return res.status(404).json({ message: "Finance record not found" });
    }

    if (
      req.user.role !== "admin" &&
      finance.createdBy.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to modify this finance record" });
    }

    if (expenses) {
      const expense = finance.expenses.id(expenses.id);
      if (!expense)
        return res.status(404).json({ message: "Expense not found" });
      expense.amount = expenses.amount;
      expense.description = expenses.description;
      expense.category = expenses.category;
    }

    if (savingsTransactions) {
      let updated = false;
      for (let plan of finance.financePlans) {
        const tx = plan.savingsTransactions.id(savingsTransactions.id);
        if (tx) {
          tx.amount = savingsTransactions.amount;
          tx.description = savingsTransactions.description;
          updated = true;
          break;
        }
      }
      if (!updated)
        return res
          .status(404)
          .json({ message: "Savings transaction not found" });
    }

    const updatedFinance = await finance.save();
    res
      .status(200)
      .json({
        message: "Finance record updated successfully",
        finance: updatedFinance,
      });
  } catch (err) {
    console.error("Error updating finance record:", err.stack);
    res
      .status(500)
      .json({ message: "Error updating finance record: " + err.message });
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

    if (
      req.user.role !== "admin" &&
      finance.createdBy.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this finance record" });
    }

    await Finance.findByIdAndDelete(id);
    res.status(200).json({ message: "Finance record deleted successfully" });
  } catch (err) {
    console.error("Error deleting finance record:", err.stack);
    res
      .status(500)
      .json({ message: "Error deleting finance record: " + err.message });
  }
});

module.exports = router;
