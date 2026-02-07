import express from "express";
import User from "../models/User.js";

const router = express.Router();

/**
 * -----------------------------------------------------
 * GET ALL TEACHERS
 * -----------------------------------------------------
 */
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" });
    res.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * -----------------------------------------------------
 * ADD A TEACHER
 * -----------------------------------------------------
 */
router.post("/teachers", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newTeacher = await User.create({
      name,
      email,
      password,
      role: "teacher",
    });

    res.status(201).json(newTeacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding teacher" });
  }
});

/**
 * -----------------------------------------------------
 * UPDATE A TEACHER
 * -----------------------------------------------------
 */
router.put("/teachers/:id", async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedTeacher = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(updatedTeacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating teacher" });
  }
});

/**
 * -----------------------------------------------------
 * DELETE A TEACHER
 * -----------------------------------------------------
 */
router.delete("/teachers/:id", async (req, res) => {
  try {
    const deletedTeacher = await User.findByIdAndDelete(req.params.id);

    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting teacher" });
  }
});

export default router;
