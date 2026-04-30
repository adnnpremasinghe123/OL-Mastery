import Payment from "../models/Payment.js";
import { generateHash } from "../utils/payhereHash.js";

const MERCHANT_ID = "1234400";

// ⚠️ IMPORTANT: use RAW secret from PayHere dashboard (NOT base64)
const MERCHANT_SECRET = "MzEyMTYwNzk0NzM5OTUxNTUxNzc1MDk0MjcwODcxMzkzMTg4MTY5";

export const createPayment = async (req, res) => {
  try {
    const { sessionId, amount, name, email, phone, userId } = req.body;

    const orderId = `ORD_${Date.now()}`;

    const formattedAmount = Number(amount).toFixed(2);

    const hash = generateHash(
      MERCHANT_ID,
      orderId,
      formattedAmount,
      "LKR",
      MERCHANT_SECRET
    );

    await Payment.create({
      sessionId,
      userId,
      orderId,
      amount: formattedAmount,
    });

    res.json({
      sandbox: true,

      merchant_id: MERCHANT_ID,
      return_url: "http://localhost:3000/payment-success",
      cancel_url: "http://localhost:3000/payment-cancel",
      notify_url: "http://localhost:8081/api/payments/notify",

      order_id: orderId,
      items: "Session Payment",
      amount: formattedAmount,
      currency: "LKR",

      first_name: name,
      last_name: "",
      email,
      phone,
      address: "Sri Lanka",
      city: "Colombo",
      country: "Sri Lanka",

      hash,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment creation failed" });
  }
};
export const handleNotify = async (req, res) => {
  const { order_id, status_code } = req.body;

  if (status_code === "2") {
    await Payment.findOneAndUpdate(
      { orderId: order_id },
      { status: "PAID" }
    );
  } else {
    await Payment.findOneAndUpdate(
      { orderId: order_id },
      { status: "FAILED" }
    );
  }

  res.sendStatus(200);
};