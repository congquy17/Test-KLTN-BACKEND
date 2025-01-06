const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Chat = require("../models/Chat");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Cho phép nguồn gốc frontend
      methods: ["GET", "POST"], // Các phương thức HTTP được phép
      allowedHeaders: ["Content-Type", "Authorization"], // Header được phép
      credentials: true, // Nếu cần gửi cookie hoặc thông tin xác thực
    },
  });
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // Khi người dùng kết nối, tham gia phòng chat riêng của user và admin
    socket.on("joinChat", ({ userId, adminId }) => {
      socket.join(userId);
      socket.join(adminId);
      console.log(`User ${userId} and Admin ${adminId} joined the chat`);
    });

    // Khi người dùng gửi tin nhắn
    socket.on("sendMessage", async (data) => {
      const { userId, adminId, content } = data;

      // Chuyển userId và adminId thành ObjectId hợp lệ
      const userObjectId = new mongoose.Types.ObjectId(userId); // Sử dụng new
      const adminObjectId = new mongoose.Types.ObjectId(adminId); // Sử dụng new

      // Tạo hoặc cập nhật chat
      let chat = await Chat.findOne({
        user: userObjectId,
        admin: adminObjectId,
      });

      if (!chat) {
        chat = new Chat({
          user: userObjectId,
          admin: adminObjectId,
          messages: [],
        });
      }

      // Thêm tin nhắn mới vào chat
      chat.messages.push({ sender: userObjectId, content });
      await chat.save();

      // Gửi tin nhắn đến cả user và admin
      io.to(userId).emit("roomChat", chat);
      io.to(adminId).emit("roomChat", chat);
    });

    // Khi người dùng ngắt kết nối
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

module.exports = initializeSocket;
