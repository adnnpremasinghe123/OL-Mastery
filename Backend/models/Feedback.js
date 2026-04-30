import mongoose from "mongoose"

const feedbackSchema = new mongoose.Schema({

  studentName: String,
  rating: Number,
  message: String,
  date: {
    type: Date,
    default: Date.now
  }

})

export default mongoose.model("Feedback", feedbackSchema)