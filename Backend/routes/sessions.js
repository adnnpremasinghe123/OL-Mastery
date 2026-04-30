import express from "express";
import Session from "../models/Session.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/mailer.js";

const router = express.Router();

/* =====================================================
   CREATE SESSION (Teacher / Admin)
   ===================================================== */
router.post("/", async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,
      payment: req.body.payment,
      meetingLink: req.body.meetingLink,
      createdBy: req.body.createdBy,
    };

    const session = await Session.create(data);

    // Notify students via email
    const students = await User.find({ role: "student" });

    for (const student of students) {
      const subject = `New Session Created: ${session.title}`;
      const text = `
Hi ${student.name},

A new learning session has been created by ${session.createdBy}.

📝 Title: ${session.title}
📅 Date: ${session.date}
⏰ Time: ${session.time}
💰 Payment: ${session.payment}
🔗 Join Link: ${session.meetingLink}

Don't miss it!
      `;
      sendEmail(student.email, subject, text);
    }

    res.status(201).json(session);
  } catch (err) {
    console.error("CREATE SESSION ERROR:", err);
    res.status(500).json({ error: "Failed to create session" });
  }
});

/* =====================================================
   GET ALL SESSIONS 
   ===================================================== */
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: 1 });
    res.status(200).json(sessions);
  } catch (err) {
    console.error("FETCH SESSIONS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});
/* =====================================================
   GET REQUESTED SESSION 
   ===================================================== */

router.get("/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);

  } catch (err) {
    console.error("GET SESSION ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* =====================================================
   DELETE SESSION
   ===================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session)
      return res.status(404).json({ message: "Session not found" });
    if (session.createdBy !== req.body.userName)
      return res.status(403).json({ message: "Not authorized" });


    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: "Session deleted successfully" });
  } catch (err) {
    console.error("DELETE SESSION ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* =====================================================
   EDIT SESSION
   ===================================================== */
router.put("/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session)
      return res.status(404).json({ message: "Session not found" });

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,
      payment: req.body.payment,
      meetingLink: req.body.meetingLink,
    };

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedSession);
  } catch (err) {
    console.error("EDIT SESSION ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
