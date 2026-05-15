import express from "express";
import Chat from "../models/Chat.js";
import olData from "../data/olData.js";

const router = express.Router();


// ===============================
// SEND MESSAGE
// ===============================
router.post("/", async (req, res) => {
  try {
    const { message, subject } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message required" });
    }

    const lowerMessage = message.toLowerCase();
    const selectedSubject = subject || "General";

    let foundAnswer = null;

    for (const item of olData) {
      if (item.subject !== selectedSubject) continue;

      if (
        item.keywords.some((k) =>
          lowerMessage.includes(k.toLowerCase())
        )
      ) {
        foundAnswer = item.answer;
        break;
      }
    }

    if (!foundAnswer) {
      foundAnswer = `Sorry, no answer found for ${selectedSubject}`;
    }

    const chat = new Chat({
      subject: selectedSubject,
      userMessage: message,
      botReply: foundAnswer,
    });

    await chat.save();

    res.json({
      reply: foundAnswer,
      subject: selectedSubject,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});


// ===============================
// GET HISTORY
// ===============================
router.get("/history/:subject", async (req, res) => {
  try {
    const chats = await Chat.find({
      subject: req.params.subject,
    }).sort({ createdAt: 1 });

    res.json(chats);

  } catch (err) {
    res.status(500).json({ message: "Error loading chat" });
  }
});


// ===============================
// CLEAR CHAT
// ===============================
router.delete("/clear/:subject", async (req, res) => {
  try {
    await Chat.deleteMany({
      subject: req.params.subject,
    });

    res.json({ message: "Chat cleared" });

  } catch (err) {
    res.status(500).json({ message: "Error clearing chat" });
  }
});

export default router;