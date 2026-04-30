import express from "express";
import { createQuiz, getAllQuizzes, getQuizById, deleteQuiz } from "../controllers/quizController.js";


const router = express.Router();

router.post("/", createQuiz);
router.get("/all", getAllQuizzes);
router.get("/:id", getQuizById);
router.delete("/:id", deleteQuiz);


export default router;