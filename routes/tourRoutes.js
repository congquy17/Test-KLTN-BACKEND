const express = require("express");
const {
  getTours,
  createTour,
  getTourById,
} = require("../controllers/tourController");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage }); // Sử dụng storage từ Cloudinary

const router = express.Router();

// Route thêm tour với upload file
router.post(
  "/",
  upload.fields([
    { name: "main_image", maxCount: 1 }, // Upload 1 file cho main_image
    { name: "sub_images", maxCount: 5 }, // Upload tối đa 5 file cho sub_images
  ]),
  createTour
);

router.get("/", getTours); // Lấy tất cả tours
router.get("/:id", getTourById); // Lấy chi tiết tour theo _id

module.exports = router;
