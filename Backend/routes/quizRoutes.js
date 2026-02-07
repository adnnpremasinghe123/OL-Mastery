import express from "express";
import Quiz from "../models/quizModel.js";

const router = express.Router();

/* ------------------------------
   CREATE QUIZ
-------------------------------*/
router.post("/", async (req, res) => {
  try {
    const { title, questions, userName, userRole } = req.body;

    const quiz = await Quiz.create({
      title,
      questions,
      createdBy: userName || "Teacher",
      creatorRole: userRole || "teacher",
    });

    res.status(201).json(quiz);
  } catch (err) {
    console.error("CREATE QUIZ ERROR:", err);
    res.status(500).json({ message: "Failed to create quiz" });
  }
});

/* ------------------------------
   GET ALL QUIZZES
-------------------------------*/
router.get("/all", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (err) {
    console.error("FETCH QUIZZES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
});

/* ------------------------------
   UPDATE QUIZ (ONLY ADMIN)
-------------------------------*/
router.put("/:id", async (req, res) => {
  try {
    const { userRole, title, questions } = req.body;

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Only admin can edit quizzes" });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title, questions },
      { new: true }
    );

    if (!updatedQuiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(200).json(updatedQuiz);
  } catch (err) {
    console.error("UPDATE QUIZ ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ------------------------------
   DELETE QUIZ (ONLY ADMIN)
-------------------------------*/
router.delete("/:id", async (req, res) => {
  try {
    const { userRole } = req.body;

    if (userRole !== "admin") {
      return res.status(403).json({ message: "Only admin can delete quizzes" });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    await Quiz.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (err) {
    console.error("DELETE QUIZ ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
