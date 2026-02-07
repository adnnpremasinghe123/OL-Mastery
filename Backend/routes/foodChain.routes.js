// routes/foodChain.routes.js
import express from "express";
import FoodChainScore from "../models/FoodChainScore.js";

const router = express.Router();

// POST /api/food-chain/submit
router.post("/submit", async (req, res) => {
  const { userId, userName, score } = req.body;

  if (!userId || !userName || score == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newScore = new FoodChainScore({ userId, userName, score });
    await newScore.save();
    res.status(201).json({ message: "Score saved successfully", score: newScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save score", error: err.message });
  }
});

export default router;
