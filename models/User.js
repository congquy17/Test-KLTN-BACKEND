const mongoose = require("mongoose");

// Định nghĩa Schema cho User
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    phone: { type: String },
    avatar: { type: String }, // Lưu link ảnh avatar
    role: {
      type: String,
      enum: ["admin", "user", "adminChat"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Tạo model từ schema
module.exports = mongoose.model("User", userSchema);
