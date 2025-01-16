const Chat = require("../models/Chat");

exports.getAdminConversations = async (req, res) => {
  try {
    const { adminId } = req.query; // Lấy adminId từ query

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required." });
    }

    // Lấy tất cả các cuộc trò chuyện liên quan đến admin
    const conversations = await Chat.find({ admin: adminId })
      .sort({ updatedAt: -1 }) // Sắp xếp theo thời gian cập nhật mới nhất
      .populate("user", "name email")
      .populate("admin", "name email");

    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
