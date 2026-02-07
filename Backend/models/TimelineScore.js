import mongoose from "mongoose";

const TimelineScoreSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  score: { type: Number, required: true },
  game: { type: String, default: "Timeline Sort Game" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("TimelineScore", TimelineScoreSchema);
