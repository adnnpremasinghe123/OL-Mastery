// routes/quizRoutes.js
import express from "express";
import * as quizController from "../controllers/quizController.js";

const router = express.Router();

// ROUTES
router.post("/create", quizController.createQuiz);
router.get("/all", quizController.getAllQuizzes);
router.get("/:id", quizController.getQuizById);

export default router;
