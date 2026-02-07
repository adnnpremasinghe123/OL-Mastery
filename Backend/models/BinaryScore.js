import mongoose from "mongoose";

const BinaryScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("BinaryScore", BinaryScoreSchema);
