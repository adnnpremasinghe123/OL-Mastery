// connectDB.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true); // optional, avoids query warnings

    await mongoose.connect(process.env.MONGO_URI); // ⬅️ Removed deprecated options

    console.log("🔥 MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    throw new Error("MongoDB connection failed. Server not started.");
  }
};

export default connectDB;