const express = require("express");
const router = express.Router();
const {
  register,
  login,
  googleLogin,
  getAdminChat,
} = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");

router.post("/register", upload.single("avatar"), register);

// Đăng nhập
router.post("/login", login);
router.post("/google-login", googleLogin);
router.get("/adminChat", getAdminChat);
module.exports = router;
