const mongoose = require("mongoose");

const orderStatusSchema = new mongoose.Schema({
  school_id: { type: String, required: true },
  collect_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  order_amount: Number,
  transaction_amount: Number,
  payment_mode: String,
  payment_details: String,
  bank_reference: String,
  payment_message: String,
  status: String,
  error_message: String,
  payment_time: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("OrderStatus", orderStatusSchema);
