import express from "express";
import { updateQuiz, updateActivity, updatePost } from "../controllers/events.js";
import { getLeaderboard } from "../controllers/Leaderboard.js";

const router = express.Router();

router.post("/event/quiz", updateQuiz);
router.post("/event/activity", updateActivity);
router.post("/event/post", updatePost);

router.get("/leaderboard", getLeaderboard);

export default router;
