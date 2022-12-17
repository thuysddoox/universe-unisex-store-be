const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    content: {
      type: String,
    },
    rate: {
      type: Number,
      default: 5,
    },
    replyComments: [{
      content: String,
      owner: String,
    }],
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
