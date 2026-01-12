import Quiz from "../models/quizModel.js";

// CREATE QUIZ
export const createQuiz = async (req, res) => {
  try {
    const { title, questions, teacherId } = req.body;

    if (!title || !questions) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const quiz = new Quiz({
      title,
      questions,
      createdBy: teacherId || null
    });

    await quiz.save();

    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error("❌ Error creating quiz:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET ALL QUIZZES
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("❌ Error fetching quizzes:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET SINGLE QUIZ
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
