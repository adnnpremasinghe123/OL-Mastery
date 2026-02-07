// models/VocabularyMatchScore.js
import mongoose from "mongoose";

const VocabularyMatchScoreSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const VocabularyMatchScore = mongoose.model("VocabularyMatchScore", VocabularyMatchScoreSchema);

export default VocabularyMatchScore;
