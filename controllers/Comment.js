const Comment = require("../models/Comment");
const { APIfeatures } = require("../utils/filter");

exports.getAllComments = async (req, res, next) => {
  try {
    const features = new APIfeatures(Comment.find(), req.query).paginating().sorting().searching();
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
    const comments = await Comment.find({ productId: req.params.id });
    res.status(200).send({ responseData: { comments }, status: 200 });
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
};

exports.createComment = async (req, res, next) => {
  const comment = new Comment({
    ...req.body,
  });
  try {
    await comment.save();
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
      const commentRep = new Comment({
        ...req.body,
      });
      const comment = await Comment.findById(req.params.id);
      comment.replyComments.push(commentRep);
      await comment.save();
      await commentRep.save();
      res.status(201).json({
        responseData: { comment: comment },
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
