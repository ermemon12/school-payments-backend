const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const Order = require("../models/Order");
const OrderStatus = require("../models/OrderStatus");

// Payment API Credentials
const PG_KEY = process.env.PG_KEY;
const API_KEY = process.env.PAYMENT_API_KEY;
const SCHOOL_ID = process.env.SCHOOL_ID;

// ==========================
// Create Payment
// ==========================
router.post("/create-payment", authMiddleware, async (req, res) => {
    const { amount, customer_name, customer_email } = req.body;
    if (!amount || !customer_name || !customer_email) {
        return res.status(400).json({ error: "Please provide all fields" });
    }

    try {
        // Save initial order
        const newOrder = await Order.create({
            school_id: SCHOOL_ID,
            trustee_name: "",
            student_name: customer_name,
            order_amount: amount,
            customer_email,
        });

        // JWT payload for payment
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

        // Sign JWT
        const token = jwt.sign(payload, API_KEY, {
            algorithm: "HS256",
            expiresIn: "10m",
        });

        console.log("✅ Payment Payload:", payload);
        console.log("✅ JWT Token:", token);

        // Simulated payment link
        const payment_link = `http://localhost:3000/payment-success?order_id=${newOrder._id}`;

        // Simulate webhook call
        const webhookPayload = {
            order_info: {
                collect_id: newOrder._id.toString(),
                order_amount: amount,
                transaction_amount: amount,
                gateway: "upi",
                bank_reference: "LOCAL123",
                status: "success",
                payment_mode: "upi",
                payment_details: `${customer_name.toLowerCase()}@upi`,
                Payment_message: "payment success",
                payment_time: new Date(),
                error_message: "NA",
            },
        };

        await axios.post("http://localhost:5000/api/webhook", webhookPayload);

        res.status(200).json({ payment_link });
    } catch (err) {
        console.error("❌ Error creating payment:", err.message);
        res.status(500).json({ error: "Failed to create payment" });
    }
});

// ==========================
// Get all transactions
// ==========================
router.get("/transactions", authMiddleware, async (req, res) => {
    try {
        const transactions = await OrderStatus.find()
            .populate("collect_id")
            .sort({ payment_time: -1 });

        res.status(200).json(transactions);
    } catch (err) {
        console.error("❌ Error fetching transactions:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================
// Get transactions by school
// ==========================
router.get("/transactions/school/:schoolId", authMiddleware, async (req, res) => {
    try {
        const { schoolId } = req.params;

        const orders = await Order.find({ school_id: schoolId });

        if (!orders.length) {
            return res.status(404).json({ error: "No orders found for this school" });
        }

        const orderIds = orders.map((o) => o._id);

        const transactions = await OrderStatus.find({
            collect_id: { $in: orderIds },
        })
            .populate("collect_id")
            .sort({ payment_time: -1 });

        res.status(200).json(transactions);
    } catch (err) {
        console.error("❌ Error fetching school transactions:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================
// Get transaction by order ID
// ==========================
router.get("/transaction-status/:orderId", authMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params;

        const transaction = await OrderStatus.findOne({
            collect_id: orderId,
        }).populate("collect_id");

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.status(200).json(transaction);
    } catch (err) {
        console.error("❌ Error fetching transaction:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
