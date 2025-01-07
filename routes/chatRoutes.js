const express = require("express");
const { getChat } = require("../controllers/chatController");
const router = express.Router();

// Lấy chat giữa user và admin
router.get("/:userId/:adminId", getChat);

module.exports = router;
