const express = require("express");
const router = express.Router();
const {
  register,
  login,
  googleLogin,
} = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");

router.post("/register", upload.single("avatar"), register);

// Đăng nhập
router.post("/login", login);
router.post("/google-login", googleLogin);

module.exports = router;
