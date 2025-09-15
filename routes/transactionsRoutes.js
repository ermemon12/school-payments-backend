// routes/transactionRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const OrderStatus = require("../models/OrderStatus");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================
// GET all transactions
// ==========================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await OrderStatus.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "collect_id",
          foreignField: "_id",
          as: "order_info"
        }
      },
      { $unwind: "$order_info" },
      {
        $project: {
          collect_id: "$_id",
          custom_order_id: "$order_info._id",
          school_id: 1,
          trustee_name: 1,          // ✅ added
          student_name: 1,          // ✅ added
          customer_email: 1,        // ✅ added
          gateway: "$gateway",
          order_amount: 1,
          transaction_amount: 1,
          status: 1,
          payment_mode: 1,
          payment_details: 1,
          bank_reference: 1,
          payment_message: 1,
          payment_time: 1
        }
      },
      { $sort: { payment_time: -1 } }
    ]);

    res.status(200).json(transactions);
  } catch (err) {
    console.error("❌ Error fetching transactions:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ==========================
// GET transactions by school ID
// ==========================
router.get("/school/:schoolId", authMiddleware, async (req, res) => {
  try {
    const { schoolId } = req.params;

    const transactions = await OrderStatus.aggregate([
      { $match: { school_id: schoolId } },
      {
        $lookup: {
          from: "orders",
          localField: "collect_id",
          foreignField: "_id",
          as: "order_info"
        }
      },
      { $unwind: "$order_info" },
      {
        $project: {
          collect_id: "$_id",
          custom_order_id: "$order_info._id",
          school_id: 1,
          trustee_name: 1,          // ✅ added
          student_name: 1,          // ✅ added
          customer_email: 1,        // ✅ added
          gateway: "$gateway",
          order_amount: 1,
          transaction_amount: 1,
          status: 1,
          payment_mode: 1,
          payment_details: 1,
          bank_reference: 1,
          payment_message: 1,
          payment_time: 1
        }
      },
      { $sort: { payment_time: -1 } }
    ]);

    if (!transactions.length) {
      return res.status(404).json({ message: "No transactions found for this school" });
    }

    res.status(200).json(transactions);
  } catch (err) {
    console.error("❌ Error fetching school transactions:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ==========================
// GET transaction by custom order ID
// ==========================
router.get("/transaction-status/:custom_order_id", authMiddleware, async (req, res) => {
  try {
    const { custom_order_id } = req.params;

    const transaction = await OrderStatus.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "collect_id",
          foreignField: "_id",
          as: "order_info"
        }
      },
      { $unwind: "$order_info" },
      { $match: { "order_info._id": new mongoose.Types.ObjectId(custom_order_id) } },
      {
        $project: {
          collect_id: "$_id",
          custom_order_id: "$order_info._id",
          school_id: 1,
          trustee_name: 1,          // ✅ added
          student_name: 1,          // ✅ added
          customer_email: 1,        // ✅ added
          gateway: "$gateway",
          order_amount: 1,
          transaction_amount: 1,
          status: 1,
          payment_mode: 1,
          payment_details: 1,
          bank_reference: 1,
          payment_message: 1,
          payment_time: 1
        }
      }
    ]);

    if (!transaction.length) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction[0]);
  } catch (err) {
    console.error("❌ Error fetching transaction:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
