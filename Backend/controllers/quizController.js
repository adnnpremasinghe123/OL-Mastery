import Quiz from "../models/quizModel.js";
import { notifyStudentsAboutQuiz } from "../routes/sendQuizEmails.js";





//create quiz
export const createQuiz = async (req, res) => {
  try {
    const { title, questions, name, timeLimit, startDate, startTime } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Title and questions required" });
    }

    // ✅ VALIDATE DATE + TIME
    if (!startDate || !startTime) {
      return res.status(400).json({ message: "Start date and time required" });
    }

    // ✅ COMBINE DATE + TIME
    const startDateTime = new Date(`${startDate}T${startTime}`);

    if (isNaN(startDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid start time" });
    }

    const fixedQuestions = questions.map((q, i) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length < 2) {
        throw new Error(`Invalid question ${i + 1}`);
      }

      const correct = q.options.find(
        (opt) => opt.trim() === q.correctAnswer?.trim()
      );

      if (!correct) {
        throw new Error(`Correct answer mismatch in question ${i + 1}`);
      }

      return {
        question: q.question,
        options: q.options,
        correctAnswer: correct,
      };
    });

    const quiz = await Quiz.create({
      title,
      questions: fixedQuestions,
      timeLimit: timeLimit || 30,
      createdBy: name || "Unknown",
      creatorRole: "teacher",
      startTime: startDateTime, // ✅ SAVE HERE
    });

     // Call the email notifier (separate module)
    notifyStudentsAboutQuiz({
      title: quiz.title,
      createdBy: name,
      startDate,
      startTime,
      timeLimit,
    });


    res.status(201).json({
      message: "Quiz created with schedule",
      quiz,
    });

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET ALL
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: "Fetch error" });
  }
};

// GET ONE
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Not found" });
    res.json(quiz);
  } catch {
    res.status(500).json({ message: "Invalid ID" });
  }
};


// DELETE
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Not found" });

    await quiz.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete error" });
  }
};
