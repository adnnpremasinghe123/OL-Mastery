// server.js
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";
import path from "path";

// Models
import Message from "./models/Message.js";

// Routes
import userRoutes from "./routes/users.js";
import quizRoutes from "./routes/quizRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import sessionRoutes from "./routes/sessions.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ------------------ Middlewares ------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------ Serve Uploads Folder ------------------
// Make uploads accessible via /uploads
const __dirname = path.resolve(); // needed in ES modules
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------ MongoDB Connection ------------------
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
})();

// ------------------ Routes ------------------
app.use("/api/users", userRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/sessions", sessionRoutes);

// ------------------ Messages REST API ------------------
app.get("/api/messages/:subject", async (req, res) => {
  try {
    const messages = await Message.find({ subject: req.params.subject }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Error fetching messages" });
  }
});

app.delete("/api/messages/:id", async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Message not found" });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error deleting message" });
  }
});

// ------------------ Active Users Feature ------------------
const activeUsers = {}; // Format: { subject: [{ socketId, name }] }

// ------------------ Socket.IO ------------------
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // User joins a subject room
  socket.on("joinRoom", ({ user, subject }) => {
    socket.join(subject);
    activeUsers[subject] ??= [];
    activeUsers[subject].push({ socketId: socket.id, name: user });

    io.to(subject).emit("activeUsers", activeUsers[subject]);
    console.log(`👤 ${user} joined room: ${subject}`);
  });

  // Send message
  socket.on("sendMessage", async (data) => {
    try {
      const newMessage = await Message.create(data);
      io.to(data.subject).emit("receiveMessage", newMessage);
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });

  // Delete message
  socket.on("deleteMessage", async ({ messageId, subject }) => {
    try {
      await Message.findByIdAndDelete(messageId);
      io.to(subject).emit("messageDeleted", messageId);
      console.log(`🗑 Message deleted: ${messageId}`);
    } catch (err) {
      console.error("❌ Error deleting message:", err);
    }
  });

  // Disconnect user
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);

    Object.keys(activeUsers).forEach((subject) => {
      activeUsers[subject] = activeUsers[subject].filter(
        (u) => u.socketId !== socket.id
      );
      io.to(subject).emit("activeUsers", activeUsers[subject]);
    });
  });
});

// ------------------ Health Check ------------------
app.get("/", (req, res) => res.send("OLMastery API running 🚀"));

// ------------------ Start Server ------------------
const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
