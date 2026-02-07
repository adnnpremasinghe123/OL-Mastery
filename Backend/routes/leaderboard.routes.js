import express from "express";
import MathScore from "../models/MathScore.js";
import AlgebraScore from "../models/AlgebraScore.js";
import BinaryScore from "../models/BinaryScore.js";
import FoodChainScore from "../models/FoodChainScore.js";
import GrammarFixScore from "../models/GrammarFixScore.js";
import BodyScore from "../models/BodyScore.js";
import TimelineScore from "../models/TimelineScore.js";
import VocabularyMatchScore from "../models/VocabularyMatchScore.js";

const router = express.Router();

// 🔹 GET: Aggregated leaderboard by userId
router.get("/", async (req, res) => {
  try {
    const allScores = [
      ...(await MathScore.find()),
      ...(await AlgebraScore.find()),
      ...(await BinaryScore.find()),
      ...(await FoodChainScore.find()),
      ...(await GrammarFixScore.find()),
      ...(await BodyScore.find()),
      ...(await TimelineScore.find()),
      ...(await VocabularyMatchScore.find())
    ];

    const userTotals = {};

    allScores.forEach((s) => {
      if (!s.userId) return; // safety check

      if (!userTotals[s.userId]) {
        userTotals[s.userId] = {
          userId: s.userId,
          userName: s.userName,
          totalScore: 0
        };
      }

      userTotals[s.userId].totalScore += s.score;
    });

    const leaderboard = Object.values(userTotals).sort(
      (a, b) => b.totalScore - a.totalScore
    );

    res.status(200).json(leaderboard);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load leaderboard" });
  }
});

export default router;
