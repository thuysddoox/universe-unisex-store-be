const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  thumbnail: {
    type: String,
  },
  stock: {
    type: Number,
    default: 0,
  },
  sold: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  }
});
const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
