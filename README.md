# School Payments Backend

A secure, scalable backend API for managing school transactions, including user authentication, payments, and transaction tracking. Built with Node.js, Express, and MongoDB.

## Table of Contents

Features

Tech Stack

Getting Started

Environment Variables

API Routes

CORS Setup

Deployment

License

## Features

 User Authentication: Register, login, and JWT-based authentication.

 Payment Handling: Create, track, and manage payments securely.

 Transaction Management: Fetch transactions by user or school.

 Webhook Support: Handle payment gateway webhooks for real-time updates.

 Secure & Scalable: CORS configured, JSON parsing, and centralized error handling.

## Tech Stack

Backend: Node.js, Express.js

Database: MongoDB (local or cloud)

Authentication: JWT (JSON Web Tokens)

Deployment: Render / Netlify (for frontend)

## Getting Started
Prerequisites

Node.js (v18+ recommended)

MongoDB (local or Atlas)

npm

Installation

    # Clone the repository
     git clone https://github.com/<your-username>/school-payments-backend.git
     cd school-payments-backend

    # Install dependencies
     npm install

    # Run the server
     npm start


The server will run at:

    http://localhost:5000

## Environment Variables

Create a .env file at the root:

    PORT=5000
    MONGO_URI=mongodb://localhost:27017/abcd  # or your MongoDB Atlas URI
    JWT_SECRET=your_jwt_secret_key
    PAYMENT_API_KEY=your_payment_gateway_api_key
    PG_KEY=your_pg_key_if_needed


Note: Never commit .env to version control. Keep secrets safe.

## API Routes
### Authentication

    POST /api/users/register
Register a new user.
Body: { name, email, password }

    POST /api/users/login
Login user and get JWT token.
Body: { email, password }

### Payments

    POST /api/payments/
Create a new payment. Requires JWT auth.

    GET /api/payments/
Fetch all payments for the authenticated user.

### Transactions

    GET /api/transactions/
Fetch all transactions (admin).

    GET /api/transactions/school/:schoolId
Fetch transactions for a specific school.

### Webhooks

    POST /api/webhook/
Handle payment gateway callbacks.

CORS Setup

CORS is enabled for the frontend URLs and local testing:

    const allowedOrigins = [
      "http://localhost:3000",
      "https://stellular-pavlova-772835.netlify.app",
       "https://school-payments-backend-42rn.onrender.com"
    ];

    app.use(cors({
    origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error(`CORS policy does not allow access from ${origin}`), false);
    }
    return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
    }));

## Deployment
Render

Push your code to GitHub.

Connect your repository to Render.

Set environment variables in Render dashboard.

Deploy. Server will be available at https://<your-backend>.onrender.com.

### Notes

JWT token must be sent in headers for protected routes:

Authorization: Bearer <token>

Make sure frontend matches backend API URLs.

Test webhooks using payment gateway sandbox environment.

## Deployed Link: https://school-payments-backend-42rn.onrender.com
