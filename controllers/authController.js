const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Đăng ký người dùng
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lấy đường dẫn avatar từ file đã upload
    const avatar = req.file?.path || ""; // Avatar lưu từ Cloudinary

    // Tạo user mới
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      avatar,
      role: role || "user",
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully.", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // Xác thực token của Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    // Kiểm tra user đã tồn tại chưa
    let user = await User.findOne({ email });
    if (!user) {
      // Tạo user mới nếu chưa tồn tại
      user = new User({
        name,
        email,
        avatar: picture,
        password: null, // Không cần mật khẩu cho đăng nhập Google
        role: "user",
      });

      await user.save();
    }

    // Tạo JWT token
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Google login failed.", error: error.message });
  }
};
exports.getAdminChat = async (req, res) => {
  try {
    const adminChats = await User.find({ role: "adminChat" });

    if (!adminChats || adminChats.length === 0) {
      return res.status(404).json({ message: "No adminChat available." });
    }

    // Lấy admin đầu tiên (hoặc có thể triển khai logic khác như Round Robin)
    const adminChat = adminChats[0];

    res.status(200).json({
      message: "AdminChat fetched successfully.",
      adminId: adminChat._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
