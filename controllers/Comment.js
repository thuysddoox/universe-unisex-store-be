const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Order = require("../models/Order");
const { APIfeatures } = require("../utils/filter");
const Product = require("../models/Product");

exports.getAllComments = async (req, res, next) => {
  try {
    const features = new APIfeatures(Comment.find({ isDisabled: false }).populate({
      path: 'productId',
      model: 'Product',
    }).populate({
      path: 'owner',
      model: 'User',
    }), req.query).paginating().sorting().searching();
    const comments = await features.query;
    const total = await Comment.countDocuments();
    res.status(200).send({
      responseData: comments,
      page: features.queryString.pageIndex || 1,
      page_size: features.queryString.pageSize * 1 || 12,
      total: total,
    })
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
};

exports.getCommentOfProduct = async (req, res, next) => {
  try {
    const features = new APIfeatures(Comment.find({ productId: req.params.id, isDisabled: false }).populate({
      path: 'owner',
      model: 'User',
    }), req.query).paginating().sorting();
    const comments = await features.query;
    const total = await Comment.countDocuments();
    res.status(200).send({ responseData: comments, total, status: 200 });
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
};

exports.getRateOfProduct = async (req, res, next) => {
  try {
    const data = await Comment.aggregate([
      {
        $match: { productId: mongoose.Types.ObjectId(req?.query?.productId) }
      },
      {
        $group: {
          _id: "$rate",
          count: { $sum: 1 },
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    const total = await Comment.countDocuments({ productId: mongoose.Types.ObjectId(req?.query?.productId) })
    const average = Math.ceil(data.reduce((total, value) => total + value._id * value.count, 0) / total * 10) / 10
    res.status(200).send({ responseData: data, average, total, status: 200 });
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
};

exports.createComment = async (req, res, next) => {

  try {
    console.log(req.body.comments)
    const comment = await Promise.all(req.body.comments?.map(comment => new Comment({
      ...comment,
    }).save()));
    const order = await Order.findById(req.body.orderId);
    order.status = 5;
    await order.save();
    const data = await Comment.aggregate([
      {
        $group: {
          _id: "$productId",
          rate: {
            $sum: "$rate",
          },
          review: { $sum: 1 }
        }
      },
    ]);
    data.forEach(async (item) => {
      const p = await Product.findById(item?._id);
      p.rate = Math.floor(item.rate / item.review * 10) / 10;
      await p.save();

    })
    console.log(data)
    // await comment.save();
    res.status(201).json({
      responseData: { comment: comment },
      status: 201,
      message: "Created comment successfully!",
    });
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
};
exports.replyComment = async (req, res, next) => {
  try {
    if (req.user && req.user.isAdmin) {
      const comment = await Comment.findById(req.params.id);
      comment.replyComments.push({ ...req.body, createdAt: new Date() });
      await comment.save();
      res.status(201).json({
        responseData: comment,
        status: 201,
        message: "Created comment successfully!",
      });
    }
    else res.status(401).send({ message: "You don't allow to do that!" });
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
};
exports.updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) res.status(404).send({ message: "Comment isn't exist!" });
    else {
      const fieldsUpdate = ["content", "rate", "images", "replyComments"];
      fieldsUpdate.forEach((field) => {
        if (req.body[field]) comment[field] = req.body[field];
      });
      await comment.save();
      res.status(200).send({
        responseData: { comment },
        message: "Comment is updated successfully!",
      });
    }
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) res.status(404).send({ message: "Comment isn't exist!" });
    else {
      comment.isDisabled = true;
      await comment.save();
      res.status(200).send({ message: "Comment is deleted successfully!" })
    };
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
};
exports.disableComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) res.status(404).send({ message: "Comment isn't exist!" });
    else {
      comment.isDisabled = !comment.isDisabled;
      res.status(200).send({
        message: `Comment is ${comment.isDisabled ? "disabled" : "enabled"
          } successfully!`,
      });
    }
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
};
