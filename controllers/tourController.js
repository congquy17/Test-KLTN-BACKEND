const Tour = require("../models/Tour");
const Category = require("../models/Category");

// Lấy tất cả tours
exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find().populate("category_id", "name description");
    res.status(200).json(tours);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tours", error: error.message });
  }
};

// Lấy chi tiết tour theo _id
exports.getTourById = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id).populate(
      "category_id",
      "name description"
    );
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.status(200).json(tour);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tour", error: error.message });
  }
};

// Tạo tour mới với upload file lên Cloudinary
exports.createTour = async (req, res) => {
  try {
    const {
      name,
      description,
      destination,
      price,
      duration,
      start_date,
      end_date,
      capacity,
      status,
      available_slots,
      content,
      category_name,
    } = req.body;

    // Tìm Category theo name
    const category = await Category.findOne({ name: category_name });
    if (!category) {
      return res
        .status(404)
        .json({ message: `Category with name '${category_name}' not found` });
    }

    // Lấy đường dẫn file từ Cloudinary
    const mainImagePath = req.files.main_image
      ? req.files.main_image[0].path
      : null;
    const subImagesPaths = req.files.sub_images
      ? req.files.sub_images.map((file) => file.path)
      : [];

    const newTour = new Tour({
      name,
      description,
      destination,
      price,
      duration,
      start_date,
      end_date,
      capacity,
      status,
      available_slots,
      main_image: mainImagePath, // Đường dẫn ảnh từ Cloudinary
      sub_images: subImagesPaths, // Đường dẫn ảnh từ Cloudinary
      content: JSON.parse(content), // Convert JSON string thành object
      category_id: category._id,
    });

    const savedTour = await newTour.save();
    res.status(201).json(savedTour);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating tour", error: error.message });
  }
};
exports.getToursByCategory = async (req, res) => {
  try {
    const { categoryName } = req.query;

    console.log("Received categoryName:", categoryName); // Log để kiểm tra

    // Tìm danh mục theo tên
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      console.log("Category not found:", categoryName); // Log để kiểm tra
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    console.log("Found category:", category); // Log để kiểm tra

    // Tìm các tours thuộc danh mục đó
    const tours = await Tour.find({ category_id: category._id }).populate(
      "category_id",
      "name description"
    );

    console.log("Found tours:", tours); // Log để kiểm tra

    res.status(200).json(tours);
  } catch (error) {
    console.error("Error fetching tours by category:", error.message);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
