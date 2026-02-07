import mongoose from "mongoose";

const mathScoreSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    userName: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    game: {
      type: String,
      default: "Quick Math"
    }
  },
  { timestamps: true }
);

export default mongoose.model("MathScore", mathScoreSchema);
