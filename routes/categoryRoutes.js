const express = require("express");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

// Routes
router.get("/", getCategories); // Lấy tất cả danh mục
router.get("/:id", getCategoryById); // Lấy chi tiết danh mục theo _id
router.post("/", createCategory); // Tạo danh mục mới
router.put("/:id", updateCategory); // Cập nhật danh mục
router.delete("/:id", deleteCategory); // Xóa danh mục

module.exports = router;
