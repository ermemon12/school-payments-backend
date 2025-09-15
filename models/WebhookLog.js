// routes/webhookRoutes.js
const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const OrderStatus = require("../models/OrderStatus");

router.post("/", async (req, res) => {
  try {
    const { order_info } = req.body;

    if (!order_info || !order_info.collect_id) {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }

    // find the related order
    const order = await Order.findById(order_info.collect_id);
    if (!order) {
      return res.status(404).json({ error: "Order not found for webhook" });
    }

    // create new order status
    const newStatus = new OrderStatus({
      school_id: order.school_id, // ✅ keep link with school
      collect_id: order._id,
      order_amount: order.order_amount,
      transaction_amount: order_info.transaction_amount,
      payment_mode: order_info.payment_mode,
      payment_details: order_info.payment_details,
      bank_reference: order_info.bank_reference,
      payment_message: order_info.Payment_message,
      status: order_info.status,
      error_message: order_info.error_message,
      payment_time: order_info.payment_time,
    });

    await newStatus.save();

    console.log("✅ Webhook processed successfully:", newStatus);

    res.status(200).json({ success: true, status: newStatus });
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

module.exports = router;
