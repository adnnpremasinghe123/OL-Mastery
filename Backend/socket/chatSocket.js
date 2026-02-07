
import { Server } from "socket.io";
import Message from "../models/Message.js";

const activeUsers = {};

const initChatSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("joinRoom", ({ user, subject }) => {
      socket.join(subject);
      activeUsers[subject] ??= [];
      activeUsers[subject].push({ socketId: socket.id, name: user });

      io.to(subject).emit("activeUsers", activeUsers[subject]);
    });

    socket.on("sendMessage", async (data) => {
      const message = await Message.create(data);
      io.to(data.subject).emit("receiveMessage", message);
    });

    socket.on("deleteMessage", async ({ messageId, subject }) => {
      await Message.findByIdAndDelete(messageId);
      io.to(subject).emit("messageDeleted", messageId);
    });

    socket.on("disconnect", () => {
      Object.keys(activeUsers).forEach((subject) => {
        activeUsers[subject] = activeUsers[subject].filter(
          (u) => u.socketId !== socket.id
        );
        io.to(subject).emit("activeUsers", activeUsers[subject]);
      });
    });
  });
};

export default initChatSocket;
