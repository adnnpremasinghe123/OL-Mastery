import mongoose from "mongoose";

const AlgebraScoreSchema = new mongoose.Schema({
  userId: { type: String, required: true },     // logged-in user ID
  userName: { type: String, required: true },   // logged-in user name
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }  // timestamp
});

export default mongoose.model("AlgebraScore", AlgebraScoreSchema);
