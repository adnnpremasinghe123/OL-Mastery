import express from "express";
import MathScore from "../models/MathScore.js";

const router = express.Router();

// ✅ Save score using logged-in user
router.post("/submit", async (req, res) => {
  try {
    const { userId, userName, score } = req.body;

    if (!userId || !userName || score === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newScore = new MathScore({
      userId,
      userName,
      score
    });

    await newScore.save();

    res.status(201).json({
      message: "Score saved successfully",
      data: newScore
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save score" });
  }
});

export default router;
