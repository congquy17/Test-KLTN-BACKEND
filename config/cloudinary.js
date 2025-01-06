const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Lấy từ tài khoản Cloudinary
  api_key: process.env.CLOUDINARY_API_KEY, // Lấy từ tài khoản Cloudinary
  api_secret: process.env.CLOUDINARY_API_SECRET, // Lấy từ tài khoản Cloudinary
});

// Cấu hình storage cho multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tours", // Thư mục trong Cloudinary để lưu ảnh
    allowed_formats: ["jpeg", "png", "jpg"], // Định dạng ảnh được phép
  },
});

module.exports = {
  cloudinary,
  storage,
};
