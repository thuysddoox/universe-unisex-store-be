const express = require('express');
const ENDPOINTS = require('../constants/endpoints');
const advertisementController = require("../controllers/Advertisement");
const Auth = require("../middleware/Auth");
const router = express.Router();
router.get(ENDPOINTS.ADVERTISEMENT, Auth.verifyTokenAndAuthorization, advertisementController.getAdvertisement)
router.post(ENDPOINTS.ADVERTISEMENT, Auth.verifyTokenAndAuthorization, advertisementController.createAdvertisement)
router.patch(ENDPOINTS.ADVERTISEMENT_DETAIL, Auth.verifyTokenAndAuthorization,
  advertisementController.updateAdvertisement)
router.delete(ENDPOINTS.ADVERTISEMENT_DETAIL, Auth.verifyTokenAndAuthorization, advertisementController.deleteAdvertisement)

module.exports = router;