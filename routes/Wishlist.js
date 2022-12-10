const express = require('express');
const ENDPOINTS = require('../constants/endpoints');
const wishlistController = require("../controllers/Favorite");
const Auth = require("../middleware/Auth");
const router = express.Router();

router.get(ENDPOINTS.WISHLIST, Auth.verifyToken, wishlistController.getFavoriteList);
router.post(ENDPOINTS.WISHLIST_DETAIL, Auth.verifyToken, wishlistController.handleFavorite);

module.exports = router;