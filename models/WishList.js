const mongoose = require("mongoose");

const WishListSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  products: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }]
}, { timestamps: true })

const WishList = mongoose.model('WishList', WishListSchema);
module.exports = WishList;