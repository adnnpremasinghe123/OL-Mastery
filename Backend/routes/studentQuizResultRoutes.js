// routes/studentQuizResultRoutes.js
import express from "express";
import StudentQuizResult from "../models/studentQuizResultModel.js";


const router = express.Router();

// Submit quiz result

router.post("/submit", async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      quizId,
      quizTitle,
      score,
      total,
      cheatingFlags, // 🔥 NEW
    } = req.body;

    // 🧠 AI Cheating Score Calculation
    const cheatingScore =
      (cheatingFlags?.tabSwitches || 0) * 2 +
      (cheatingFlags?.fastAnswers || 0) * 1 +
      (cheatingFlags?.copyPaste || 0) * 2 +
      (cheatingFlags?.fullScreenElements || 0) * 2;

    // 🧠 AI Decision
    let status = "normal";
    if (cheatingScore > 8) status = "suspicious";
    if (cheatingScore > 20) status = "disqualified";

    const result = await StudentQuizResult.create({
      studentId,
      studentName,
      quizId,
      quizTitle,
      score,
      total,

      // 🔥 SAVE CHEATING DATA
      cheatingFlags: {
        tabSwitches: cheatingFlags?.tabSwitches || 0,
        fastAnswers: cheatingFlags?.fastAnswers || 0,
        copyPaste: cheatingFlags?.copyPaste || 0,
        fullScreenElements: cheatingFlags?.fullScreenElements || 0,
      },

      cheatingScore,
      status,
    });

    res.status(201).json({
      message: "Quiz submitted successfully",
      result,
    });
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

// Get results by student name (student view)
router.get("/:studentName/results", async (req, res) => {
  try {
    const { studentName } = req.params;

    const results = await StudentQuizResult.find({
      studentName: studentName,
    }).sort({ createdAt: -1 }); // latest first

    res.status(200).json(results);
  } catch (err) {
    console.error("FETCH STUDENT RESULTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch student results" });
  }
});
export default router;