const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  school_id: { type: String, required: true },
  trustee_id: { type: String },
  student_info: {
    name: String,
    id: String,
    email: String,
  },
  gateway_name: String,
  order_amount: { type: Number, required: true },  // ✅ amount of the order
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" }, // ✅ track payment status
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
