// models/Resource.js
import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  uploadedBy: { type: String, required: true }, // teacher/student name
  role: { type: String, enum: ["student", "teacher", "admin"], required: true },
  fileUrl: { type: String, required: true }, // path to file
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Resource", resourceSchema);
