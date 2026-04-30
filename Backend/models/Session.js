import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  payment: { type: String, required: true },
  meetingLink: { type: String, required: true },
  createdBy: { type: String, required: true } // teacher id or name
}, { timestamps: true });

const Session = mongoose.model("Session", sessionSchema);
export default Session;
