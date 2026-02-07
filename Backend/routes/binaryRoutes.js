import express from "express";
import BinaryScore from "../models/BinaryScore.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/submit", async (req, res) => {
  const { userId, userName, score } = req.body;

  // ✅ Allow score = 0
  if (!userId || !userName || score === undefined) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const newScore = new BinaryScore({
    userId: new mongoose.Types.ObjectId(userId),
    userName,
     score: Number(score),
    });

    await newScore.save();

    res.status(201).json({ message: "Score saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save score" });
  }
});

export default router;
