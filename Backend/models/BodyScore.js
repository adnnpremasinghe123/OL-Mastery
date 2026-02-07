import mongoose from "mongoose";

const bodyScoreSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const BodyScore = mongoose.model("BodyScore", bodyScoreSchema);

export default BodyScore;
