import express from "express";
import Review from "../models/Review.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * POST /api/reviews
 */
router.post("/", async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;

    const existing = await Review.findOne({ userId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already submitted a review" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const review = await Review.create({
      userId,
      username: user.name,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/reviews
 */
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * DELETE /api/reviews/:id (admin handled frontend)
 */
router.delete("/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
