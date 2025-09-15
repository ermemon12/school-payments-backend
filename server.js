// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

// Parse JSON requests
app.use(express.json());

// Allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000",                   // local frontend
  "https://stellular-pavlova-772835.netlify.app" // deployed frontend
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman/curl
      if (!allowedOrigins.includes(origin)) {
        return callback(new Error(`CORS policy does not allow access from origin: ${origin}`), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Handle preflight requests for all routes
app.options("*", cors());

// Test route
app.get("/", (req, res) => {
  res.send("School Payments API is running...");
});

// Routes
app.use("/api/users", require("./routes/authRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/webhook", require("./routes/webhookRoutes"));
app.use("/api/transactions", require("./routes/transactionsRoutes"));

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ message: "Server error", detail: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
