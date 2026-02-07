import express from "express";
import BodyScore from "../models/BodyScore.js";

const router = express.Router();

// POST: Save score
router.post("/submit", async (req, res) => {
  const { userId, userName, score } = req.body;

  if (!userId || !userName || score === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newScore = new BodyScore({ userId, userName, score });
    await newScore.save();
    res.status(200).json({ message: "Score saved successfully", score: newScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save score" });
  }
});

// GET: Top 10 leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const scores = await BodyScore.find().sort({ score: -1 }).limit(10);
    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

export default router;
