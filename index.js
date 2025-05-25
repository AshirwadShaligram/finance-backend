import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { notFound, errorHandler } from "./middleware/error.js";

// Route files
import authRoute from "./routes/authRoute.js";
import accountRoute from "./routes/accountRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import transactionRoute from "./routes/transactionRoute.js";

// Load env vars
dotenv.config();

// Database connection (simplified for Mongoose v6+)
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

// Middleware
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.PREVIEW_URL], // frontend domain IP
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Mount routers
app.use("/api/auth", authRoute);
app.use("/api/accounts", accountRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/transactions", transactionRoute);

// Basic route
app.get("/", (req, res) => {
  res.send("MongoDB Atlas Connected Successfully!");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
