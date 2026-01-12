// models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  role: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Message", MessageSchema);
