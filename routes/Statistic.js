const express = require("express");
const ENDPOINTS = require("../constants/endpoints");
const statisticController = require("../controllers/Statistic");
const router = express.Router();
const Auth = require("../middleware/Auth");

router.get(ENDPOINTS.STATISTIC, Auth.verifyTokenAndAuthorization, statisticController.doStatistic);
router.get(ENDPOINTS.STATISTIC_MONTH, Auth.verifyTokenAndAuthorization, statisticController.statisticByMonth);
router.get(ENDPOINTS.STATISTIC_PRODUCT, Auth.verifyTokenAndAuthorization, statisticController.statisticProductOrderByMonth);
router.get(ENDPOINTS.STATISTIC_USER, Auth.verifyTokenAndAuthorization, statisticController.doStatisticByUser);

module.exports = router;
