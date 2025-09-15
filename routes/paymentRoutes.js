// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const Order = require("../models/Order");

const PG_KEY = process.env.PG_KEY;
const API_KEY = process.env.PAYMENT_API_KEY;
const SCHOOL_ID = process.env.SCHOOL_ID;

// Create Payment with random status
router.post("/create-payment", authMiddleware, async (req, res) => {
  const { amount, customer_name, customer_email, payment_mode } = req.body;

  if (!amount || !customer_name || !customer_email || !payment_mode) {
    return res.status(400).json({
      error: "Please provide all fields including payment mode",
    });
  }

  try {
    // Randomize payment status
    const statuses = ["pending", "success", "failed"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    // Random bank reference
    const bankReference = `BANK-${Math.floor(100000 + Math.random() * 900000)}`;

    const paymentTime = new Date();

    // Create new order
    const newOrder = await Order.create({
      school_id: SCHOOL_ID,
      student_info: { name: customer_name, email: customer_email },
      gateway_name: payment_mode,       // store payment mode as gateway
      order_amount: amount,
      transaction_amount: randomStatus === "success" ? amount : 0, // only successful payments have amount
      payment_mode,
      bank_reference: bankReference,
      status: randomStatus,             // ✅ randomized
      payment_message: "Payment simulated",
      payment_time: paymentTime,
      createdAt: new Date(),
    });

    // JWT payload for payment (optional)
    const payload = {
      pg_key: PG_KEY,
      school_id: SCHOOL_ID,
      order_amount: amount,
      order_currency: "INR",
      customer_name,
      customer_email,
      collect_id: newOrder._id.toString(),
      redirect_url: "http://localhost:3000/payment-success",
    };

    const token = jwt.sign(payload, API_KEY, {
      algorithm: "HS256",
      expiresIn: "10m",
    });

    const payment_link = `http://localhost:3000/payment-success?order_id=${newOrder._id}`;

    res.status(201).json({
      payment_link,
      order: newOrder,
    });
  } catch (err) {
    console.error("❌ Error creating payment:", err.message);
    res.status(500).json({ error: "Failed to create payment", message: err.message });
  }
});

module.exports = router;
