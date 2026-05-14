import express from "express";
import { createPayment, handleNotify } from "../controllers/paymentController.js";
import Payment from "../models/Payment.js";

const router = express.Router();

/* =====================================================
   GET PAYMENTS BY SESSION ID
===================================================== */
router.get("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const payments = await Payment.find({
      sessionId: sessionId,
      status: "PAID", // 🔥 only paid
    });

    res.json(payments);
  } catch (error) {
    console.error("FETCH PAYMENTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch payments" });
  }
});


router.post("/create", createPayment);
router.post("/notify", handleNotify);

export default router;