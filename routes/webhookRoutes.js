// routes/webhookRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Webhook to update payment status
router.post("/payment-webhook", async (req, res) => {
  try {
    const { order_id, status, payment_mode, transaction_amount } = req.body;

    if (!order_id) {
      return res.status(400).json({ error: "Missing order_id" });
    }

    // Randomize status if not provided
    const statuses = ["pending", "success", "failed"];
    const newStatus = status || statuses[Math.floor(Math.random() * statuses.length)];

    // Random bank reference if payment succeeds
    const bankReference =
      newStatus === "success" ? `BANK-${Math.floor(100000 + Math.random() * 900000)}` : null;

    const updatedOrder = await Order.findByIdAndUpdate(
      order_id,
      {
        status: newStatus,
        transaction_amount: newStatus === "success" ? transaction_amount || 0 : 0,
        gateway_name: payment_mode || "N/A",
        bank_reference: bankReference,
        payment_message: "Payment updated via webhook",
        payment_time: new Date(),
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Payment updated", order: updatedOrder });
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.status(500).json({ error: "Failed to update payment" });
  }
});

module.exports = router;
