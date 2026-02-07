import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question text is required"],
  },
  options: {
    type: [String],
    validate: {
      validator: (arr) => arr.length >= 2,
      message: "Each question must have at least 2 options",
    },
  },
  correctAnswer: {
    type: String,
    required: [true, "Correct answer is required"],
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "A quiz must contain at least one question",
      },
    },
    createdBy: {
      type: String, // store teacher/admin name directly
      default: "Teacher",
    },
    creatorRole: {
      type: String,
      enum: ["teacher", "admin"],
      default: "teacher",
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
