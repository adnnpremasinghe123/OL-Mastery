// routes/vocabularyMatch.routes.js
import express from "express";
import VocabularyMatchScore from "../models/VocabularyMatchScore.js";

const router = express.Router();

// POST /api/vocabulary-match/submit
router.post("/submit", async (req, res) => {
  const { userId, userName, score } = req.body;

  if (!userId || !userName || score === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newScore = new VocabularyMatchScore({ userId, userName, score });
    await newScore.save();
    res.status(201).json({ message: "Score saved successfully", newScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save score", error: err.message });
  }
});

export default router;
