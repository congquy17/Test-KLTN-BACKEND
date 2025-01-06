const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "image", "video"],
    required: true,
  },
  value: { type: String, required: true },
});

const tourSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    destination: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    capacity: { type: Number, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    available_slots: { type: Number, required: true },
    main_image: { type: String },
    sub_images: { type: [String] },
    content: [contentSchema],
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tour", tourSchema);
