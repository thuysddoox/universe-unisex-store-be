const express = require('express');
const ENDPOINTS = require('../constants/endpoints');
const router = express.Router();
const commentController = require("../controllers/Comment");
const Auth = require("../middleware/Auth");

router.get(ENDPOINTS.COMMENT, Auth.verifyTokenAndAuthorization, commentController.getAllComments);
router.get(ENDPOINTS.COMMENT_PRODUCT, commentController.getCommentOfProduct);
router.get(ENDPOINTS.COMMENT_RATE, commentController.getRateOfProduct);
router.post(ENDPOINTS.COMMENT, Auth.verifyToken, commentController.createComment);
router.patch(ENDPOINTS.COMMENT_DETAIL, Auth.verifyToken, commentController.updateComment);
router.post(ENDPOINTS.COMMENT_REPLY, Auth.verifyTokenAndAuthorization, commentController.replyComment);
router.put(ENDPOINTS.COMMENT_DETAIL, Auth.verifyToken, commentController.disableComment);
router.delete(ENDPOINTS.COMMENT_DETAIL, Auth.verifyTokenAndAuthorization, commentController.deleteComment);

module.exports = router
