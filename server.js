const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// allow frontend (localhost:3000) to talk to backend (5000)
const allowedOrigins = [
  "http://localhost:3000",                   // local frontend
  "https://your-frontend-url.netlify.app",  // deployed frontend
  "https://school-payments-backend-42rn.onrender.com" // deployed backend for API calls
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      const msg = `CORS policy does not allow access from origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));


app.get("/", (req, res) => {
  res.send("School Payments API is running...");
});

// Routes
app.use("/api/users", require("./routes/authRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/webhook", require("./routes/webhookRoutes"));
app.use("/api/transactions", require("./routes/transactionsRoutes"));

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ message: "Server error", detail: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
