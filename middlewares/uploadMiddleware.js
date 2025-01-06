const multer = require("multer");
const { storage } = require("../config/cloudinary");

// Sử dụng multer với storage từ Cloudinary
const upload = multer({ storage });

module.exports = upload;
