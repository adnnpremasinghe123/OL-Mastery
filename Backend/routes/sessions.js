import express from "express";
import Session from "../models/Session.js";

const router = express.Router();

// Create session
router.post("/", async (req, res) => {
  try {
    const session = await Session.create(req.body); // store session
    res.status(201).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create session" });
  }
});

// Get all sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: 1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

export default router;
