import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    questions: { type: Array, required: true },
    timeLimit: { type: Number, default: 30 },
    createdBy: { type: String, required: true },
    creatorRole: { type: String, default: "teacher" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // ✅ NEW FIELD
    startTime: { type: Date, required: true },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;