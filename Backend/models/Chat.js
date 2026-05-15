import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },

    userMessage: {
      type: String,
      required: true,
    },

    botReply: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;