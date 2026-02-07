import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ------------------ Update User Profile ------------------
router.put("/update/:id", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = {};

    if (name?.trim()) updateData.name = name.trim();

    if (email?.trim()) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res.status(400).json({ error: "Email already in use" });
      }
      updateData.email = email.trim();
    }

    if (password?.trim()) {
      updateData.password = password.trim(); // store plain password
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json({ user: updatedUser });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Error updating profile" });
  }
});

// ------------------ Register route ------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !password || !role) {
      return res.status(400).json({ message: "Name, password, and role are required" });
    }

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({
      name,
      email: email || undefined,
      password, // store plain password
      role,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------ Login route ------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!password || !role) {
      return res.status(400).json({ message: "Password and role are required" });
    }

    const query = {};
    if (email) query.email = email;

    const user = await User.findOne(query);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare plain passwords
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.role !== role) return res.status(400).json({ message: "Incorrect role selected" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================================
   GET ONLY STUDENTS
=============================================== */
router.get("/", async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("name email role");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students", error: err.message });
  }
});

/* ============================================
   CREATE STUDENT
=============================================== */
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const newUser = await User.create({
      name,
      email,
      password: password || "123456",
      role: role || "student",
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
});

/* ============================================
   UPDATE STUDENT
=============================================== */
router.put("/:id", async (req, res) => {
  try {
    const { name, email } = req.body;

    const updated = await User.findOneAndUpdate(
      { _id: req.params.id, role: "student" },
      { name, email },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Student not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update student", error: err.message });
  }
});

/* ============================================
   DELETE STUDENT
=============================================== */
router.delete("/:id", async (req, res) => {
  try {
    const removed = await User.findOneAndDelete({ _id: req.params.id, role: "student" });
    if (!removed) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete student", error: err.message });
  }
});

export default router;
