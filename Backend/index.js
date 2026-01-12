// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js"; // add .js for ESM

// Load environment variables
dotenv.config();

const app = express();

// ------------------ Middlewares ------------------
app.use(cors());              // allow calls from frontend
app.use(express.json());      // parse JSON bodies

// ------------------ Routes ------------------
app.use("/api/auth", authRoutes);

// optional test route
app.get("/test-db", (req, res) => res.send("Backend running"));

// ------------------ Start Server ------------------
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
