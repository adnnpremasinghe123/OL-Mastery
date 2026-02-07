// models/FoodChainScore.js
import mongoose from "mongoose";

const foodChainScoreSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("FoodChainScore", foodChainScoreSchema);
