// routes/studentQuizResultRoutes.js
import express from "express";
import StudentQuizResult from "../models/studentQuizResultModel.js";

const router = express.Router();

// Submit quiz result
router.post("/submit", async (req, res) => {
  try {
    const { studentId, studentName, quizId, quizTitle, score, total } = req.body;

    const result = await StudentQuizResult.create({
      studentId,
      studentName,
      quizId,
      quizTitle,
      score,
      total,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error("SUBMIT QUIZ RESULT ERROR:", err);
    res.status(500).json({ message: "Failed to submit quiz result" });
  }
});

// Get all results (teacher view)
router.get("/all", async (req, res) => {
  try {
    const results = await StudentQuizResult.find().sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (err) {
    console.error("FETCH RESULTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch results" });
  }
});

export default router;
