// controllers/quizController.js
import Quiz from "../models/quizModel.js";

// -------------------------
// CREATE QUIZ
// -------------------------
export const createQuiz = async (req, res) => {
  try {
    const { title, questions, teacherId } = req.body;

    // VALIDATION — TITLE
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Quiz title is required" });
    }

    // VALIDATION — QUESTIONS ARRAY
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Quiz must contain questions" });
    }

    // VALIDATE EACH QUESTION
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.question || !q.question.trim()) {
        return res.status(400).json({
          message: `Question ${i + 1} must have text`,
        });
      }

      if (!Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({
          message: `Question ${i + 1} must have at least 2 options`,
        });
      }

      if (q.options.some((opt) => !opt || !opt.trim())) {
        return res.status(400).json({
          message: `All options for Question ${i + 1} must be filled`,
        });
      }

      if (!q.correctAnswer || !q.correctAnswer.trim()) {
        return res.status(400).json({
          message: `Question ${i + 1} must have a correct answer`,
        });
      }

      if (!q.options.includes(q.correctAnswer)) {
        return res.status(400).json({
          message: `Correct answer for Question ${i + 1} must match one option`,
        });
      }
    }

    // CREATE QUIZ
    const quiz = new Quiz({
      title,
      questions,
      createdBy: teacherId || null, 
    });

    await quiz.save();

    res.status(201).json({
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    console.error("❌ Error creating quiz:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// -------------------------
// GET ALL QUIZZES
// -------------------------
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });

    res.status(200).json(quizzes);
  } catch (error) {
    console.error("❌ Error fetching quizzes:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// -------------------------
// GET QUIZ BY ID
// -------------------------
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error("❌ Error fetching quiz:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
