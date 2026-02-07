import mongoose from "mongoose";

const studentQuizResultSchema = new mongoose.Schema({
  studentId: { type: String, required: true },   // was ObjectId
  studentName: { type: String, required: true },
  quizId: { type: String, required: true },      // was ObjectId
  quizTitle: { type: String, required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
}, { timestamps: true });

const StudentQuizResult = mongoose.model("StudentQuizResult", studentQuizResultSchema);
export default StudentQuizResult;
