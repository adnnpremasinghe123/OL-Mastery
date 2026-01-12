import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ------------------ Update User Profile ------------------
router.put("/update/:id", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = {};

    // Update only if field is provided
    if (name?.trim()) updateData.name = name.trim();

    if (email?.trim()) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res.status(400).json({ error: "Email already in use" });
      }
      updateData.email = email.trim();
    }

    if (password?.trim()) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email || undefined,
      password: hashedPassword,
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

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

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

export default router;
