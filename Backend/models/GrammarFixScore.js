// models/GrammarFixScore.js
import mongoose from "mongoose";

const GrammarFixScoreSchema = new mongoose.Schema({
  userId: { type: String, required: true },   // store user ID
  userName: { type: String, required: true }, // store user name
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const GrammarFixScore = mongoose.model("GrammarFixScore", GrammarFixScoreSchema);

export default GrammarFixScore;
