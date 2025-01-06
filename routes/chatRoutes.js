const express = require("express");
const router = express.Router();
const { getChat, sendMessage } = require("../controllers/chatController");

// Lấy chat giữa user và admin
router.get("/:userId/:adminId", getChat);

// Gửi tin nhắn giữa user và admin
router.post("/send-message", sendMessage);

module.exports = router;
