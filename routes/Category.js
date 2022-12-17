const express = require('express');
const ENDPOINTS = require('../constants/endpoints');
const categoryController = require("../controllers/Category");
const router = express.Router();
const Auth = require("../middleware/Auth");
router.get(ENDPOINTS.CATEGORY, categoryController.getAllCategories);
router.post(ENDPOINTS.CATEGORY_DETAIL, Auth.verifyTokenAndAuthorization, categoryController.updateCategory);

module.exports = router;