const express = require('express');
const ENDPOINTS = require('../constants/endpoints');
const categoryController = require("../controllers/Category");
const router = express.Router();

router.get(ENDPOINTS.CATEGORY, categoryController.getAllCategories);

module.exports = router;