// routes/messages.js
import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// ✅ Get all messages for a specific subject
router.get("/:subject", async (req, res) => {
  try {
    const { subject } = req.params;
    const messages = await Message.find({ subject }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Post a new message
router.post("/", async (req, res) => {
  try {
    const { user, role, subject, content, file } = req.body;

    const newMessage = new Message({
      user,
      role,
      subject,
      content,
      file,
    });

    await newMessage.save();
    res.status(201).json({ message: "Message saved successfully!" });
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Failed to save message" });
  }
});

export default router;
