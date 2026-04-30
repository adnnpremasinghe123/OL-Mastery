import express from "express"
import Feedback from "../models/Feedback.js"

const router = express.Router()

router.post("/submit", async (req, res) => {

  try {

    const { studentName, rating, message } = req.body

    const newFeedback = new Feedback({
      studentName,
      rating,
      message
    })

    await newFeedback.save()

    res.json({ message: "Feedback saved successfully" })

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})
// GET all feedback
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ date: -1 }) // latest first
    res.json(feedbacks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router