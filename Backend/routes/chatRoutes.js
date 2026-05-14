import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// ✅ Gemini setup
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

router.post("/", async (req, res) => {
  try {
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        reply: "Gemini API key missing",
      });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Message is required",
      });
    }

    // ✅ Gemini model
   const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", 
});

    // ✅ Generate response
    const result = await model.generateContent(message);

    const response = await result.response;

    const text = response.text();

    res.json({
      reply: text,
    });

  } catch (error) {
    console.error("❌ Gemini Error:", error);

    res.status(500).json({
      reply: "AI service error",
    });
  }
});

export default router;