import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    orderId: {
      type: String,
      required: true,
      unique: true, // ✅ prevents duplicate orders
    },

    amount: {
      type: Number,
      required: true,
      min: 0, // ✅ prevents negative values
    },

    currency: {
      type: String,
      default: "LKR", // ✅ useful for PayHere
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);