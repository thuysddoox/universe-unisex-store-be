const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    cartId: {
      type: mongoose.Schema.ObjectId,
      ref: "Cart",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          required: true,
          ref: "Product",
        },
        productName: { type: String, required: true },
        price: { type: Number, required: true },
        color: { type: String },
        size: { type: String },
        discount: { type: Number },
        thumbnails: {
          type: [String],
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    fullname: { type: String, required: true },
    address: { type: Object, required: true },
    status: { type: Number, default: 0 },

    // 0: cancelled
    // 1: approving
    // 2: preparing
    // 3: shipping
    // 4: completed
    // 5: Rate

    payment: {
      type: Number,
      require: true,
      // 1: ship code, 2: pay online
    },
    phone: { type: String, require: true },
    email: { type: String, require: true },
    note: { type: String },
    isPaid: { type: Boolean, default: false },
    total: { type: Number, require: true, default: 0 },
    shipCost: { type: Number, default: 0 },
    checkoutId: {
      type: String
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
