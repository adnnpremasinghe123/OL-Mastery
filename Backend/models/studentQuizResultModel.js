import mongoose from "mongoose";

const studentQuizResultSchema = new mongoose.Schema({
  studentId: { type: String, required: true },   // was ObjectId
  studentName: { type: String, required: true },
  quizId: { type: String, required: true },      // was ObjectId
  quizTitle: { type: String, required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
 // 🔥 cheating data
    cheatingFlags: {
      tabSwitches: { type: Number, default: 0 },
      fastAnswers: { type: Number, default: 0 },
      copyPaste: { type: Number, default: 0 },
      fullscreenElements:{type:Number,default:0}
    },

    cheatingScore: { type: Number, default: 0 },
    status: { type: String, default: "normal" }, // normal / suspicious / disqualified
  },
  { timestamps: true }
);



const StudentQuizResult = mongoose.model("StudentQuizResult", studentQuizResultSchema);
export default StudentQuizResult;
