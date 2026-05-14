
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";

// Routes
import userRoutes from "./routes/users.js";
import quizRoutes from "./routes/quizRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import sessionRoutes from "./routes/sessions.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import adminRoutes from "./routes/admin.js";
import adminsRoutes from "./routes/adminsRoutes.js";
import quizResultRoutes from "./routes/studentQuizResultRoutes.js";
import algebraRoutes from "./routes/algebra.routes.js";
import mathScoreRoutes from "./routes/mathScore.routes.js";
import bodyScoreRoutes from "./routes/bodyScore.routes.js";
import foodChainRoutes from "./routes/foodChain.routes.js";
import grammarFixRoutes from "./routes/grammarFix.routes.js";
import vocabularyMatchRoutes from "./routes/vocabularyMatch.routes.js";
import timelineRoutes from "./routes/timeline.routes.js";
import binaryRoutes from "./routes/binaryRoutes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import messageRoutes from "./routes/messages.js";
import chatRoutes from "./routes/chatRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

import initChatSocket from "./socket/chatSocket.js";

const app = express();
const server = http.createServer(app);

// ------------------ Middlewares ------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------ Serve Uploads ------------------
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------ MongoDB ------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });

// ✅ Debug Gemini  Key
console.log(
  "GEMINI KEY:",
  process.env.GEMINI_API_KEY ? "LOADED ✅" : "MISSING ❌"
);

// ------------------ API Routes ------------------
app.use("/api/users", userRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api", teacherRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admins", adminsRoutes);
app.use("/api/quiz-results", quizResultRoutes);
app.use("/api/algebra", algebraRoutes);
app.use("/api/math-score", mathScoreRoutes);
app.use("/api/body-score", bodyScoreRoutes);
app.use("/api/food-chain", foodChainRoutes);
app.use("/api/grammar-fix", grammarFixRoutes);
app.use("/api/vocabulary-match", vocabularyMatchRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/binary", binaryRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use("/api/chat", chatRoutes);

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());


// ------------------ Socket Initialization ------------------
initChatSocket(server);

// ------------------ Health Check ------------------
app.get("/", (req, res) => res.send("OL MASTERY API running 🚀"));

// ------------------ Start Server ------------------
const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
