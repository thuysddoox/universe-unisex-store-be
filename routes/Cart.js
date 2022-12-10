const express = require('express');
const ENDPOINTS = require('../constants/endpoints');
const router = express.Router();
const cartController = require("../controllers/Cart");
const Auth = require("../middleware/Auth");
router.get(ENDPOINTS.CART, Auth.verifyToken, cartController.getCart);
router.post(ENDPOINTS.CART, Auth.verifyToken, cartController.addToCart);
router.patch(ENDPOINTS.CART, Auth.verifyToken, cartController.deleteFromCart);

module.exports = router;