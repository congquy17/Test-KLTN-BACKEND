const express = require("express");
const { getAdminConversations } = require("../controllers/chatController");
const router = express.Router();

// Lấy danh sách conversations cho admin
router.get("/adminchat/conversations", getAdminConversations);
module.exports = router;
