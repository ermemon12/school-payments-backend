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
  "https://your-frontend-domain.onrender.com" // deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow requests like Postman
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
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
