const Chat = require("../models/Chat");

const initializeSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Gửi tin nhắn
    socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
      try {
        // Tìm hoặc tạo đoạn chat giữa sender và receiver
        let chat = await Chat.findOne({
          $or: [
            { user: senderId, admin: receiverId },
            { user: receiverId, admin: senderId },
          ],
        });

        if (!chat) {
          // Nếu chưa có chat, tạo mới
          chat = new Chat({
            user: senderId,
            admin: receiverId,
            messages: [],
          });
          await chat.save();
          console.log("New chat created:", chat._id);
        }

        // Thêm tin nhắn mới
        const newMessage = { sender: senderId, content };
        chat.messages.push(newMessage);
        await chat.save();

        // Phát tin nhắn tới tất cả người trong phòng
        io.to(chat._id.toString()).emit("messageReceived", newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("joinRoom", async ({ senderId, receiverId }) => {
      try {
        // Tìm hoặc tạo đoạn chat giữa sender và receiver
        let chat = await Chat.findOne({
          $or: [
            { user: senderId, admin: receiverId },
            { user: receiverId, admin: senderId },
          ],
        });

        if (!chat) {
          chat = new Chat({
            user: senderId,
            admin: receiverId,
            messages: [],
          });
          await chat.save();
        }

        const chatId = chat._id.toString();
        socket.join(chatId);
        socket.emit("roomMessages", chat.messages);
        console.log(`User joined room: ${chatId}`);
      } catch (error) {
        console.error("Error joining room:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
