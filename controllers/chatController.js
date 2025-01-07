const Chat = require("../models/Chat");

// Tạo hoặc lấy chat giữa user và admin
exports.getChat = async (req, res) => {
  try {
    const { userId, adminId } = req.params;

    // Tìm chat giữa user và admin
    let chat = await Chat.findOne({ user: userId, admin: adminId });

    if (!chat) {
      // Nếu không có chat, tạo mới
      chat = new Chat({ user: userId, admin: adminId, messages: [] });
      await chat.save();
    }

    return res.json(chat);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
