const mongoose = require("mongoose");
// price: number;
// description: string;
// color: string | string[];
// id: string;
// stock: number;
// size: string | string[];
// publishedAt: string;
// thumbnails: any;
// isDisabled?: boolean;
const ProductSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Category",
    },
    name: {
      type: String,
      require: true,
      // unique: true,
    },
    price: {
      type: Number,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    color: {
      type: String,
      require: true,
    },
    thumbnails: {
      type: [String],
    },
    size: {
      type: String,
      require: true,
    },
    stock: {
      type: Number,
      require: true,
    },
    sold: {
      type: Number,
      require: false,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      default: 0,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
// ProductSchema.index({ name: "text" });
const Product = mongoose.model("Product", ProductSchema);
// Product.createIndexes({ name: "text" });

module.exports = Product;
