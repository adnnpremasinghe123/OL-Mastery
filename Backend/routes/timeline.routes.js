import express from "express";
import TimelineScore from "../models/TimelineScore.js";

const router = express.Router();

// POST /api/timeline/submit
router.post("/submit", async (req, res) => {
  const { userId, userName, score } = req.body;

  if (!userId || !userName || score === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newScore = new TimelineScore({
      userId,
      userName,
      score
    });

    await newScore.save();
    res.status(201).json({ message: "Score saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save score" });
  }
});

export default router;
