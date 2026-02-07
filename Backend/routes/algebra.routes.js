import express from "express";
import AlgebraScore from "../models/AlgebraScore.js";

const router = express.Router();

// POST: Save user score
router.post("/submit", async (req, res) => {
  const { userId, userName, score } = req.body;

  if (!userId || !userName || score == null) {
    return res.status(400).json({ message: "Missing userId, userName, or score" });
  }

  try {
    const newScore = new AlgebraScore({
      userId,
      userName,
      score
    });

    await newScore.save();

    res.status(201).json({ message: "Score saved successfully!", score: newScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save score", error: err.message });
  }
});

// GET: Leaderboard (total score per user)
router.get("/leaderboard", async (req, res) => {
  try {
    const allScores = await AlgebraScore.find();

    const userTotals = {};

    allScores.forEach(s => {
      if (!userTotals[s.userId]) {
        userTotals[s.userId] = {
          userId: s.userId,
          userName: s.userName,
          totalScore: 0
        };
      }
      userTotals[s.userId].totalScore += s.score;
    });

    const leaderboard = Object.values(userTotals).sort((a, b) => b.totalScore - a.totalScore);

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch leaderboard", error: err.message });
  }
});

export default router;
