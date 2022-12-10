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
      required: true,
      ref: "Product",
    },
    content: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
    },
    images: {
      type: [String],
    },
    name: {
      type: String,
    },
    replyComments: {
      type: [mongoose.Schema.ObjectId],
      required: false,
      ref: "Comment",
    },
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
