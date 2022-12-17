const express = require('express');
const ENDPOINTS = require('../constants/endpoints');
const router = express.Router();
const orderController = require("../controllers/Order");
const Auth = require("../middleware/Auth");

router.get(ENDPOINTS.ORDER, Auth.verifyTokenAndAuthorization, orderController.getAllOrders);
router.get(ENDPOINTS.ORDER_USER, Auth.verifyToken, orderController.getOrders);
router.get(ENDPOINTS.ORDER_STATISTIC, Auth.verifyToken, orderController.getTotalOrders);
router.get(ENDPOINTS.ORDER_DETAIL, Auth.verifyToken, orderController.getOrderDetail);
router.post(ENDPOINTS.ORDER, Auth.verifyToken, orderController.createOrder);
router.patch(ENDPOINTS.ORDER_DETAIL, Auth.verifyTokenAndAuthorization, orderController.updateOrder);
router.post(ENDPOINTS.ORDER_DETAIL, Auth.verifyToken, orderController.updateOrderClient);
router.post(ENDPOINTS.ORDER_PAY, Auth.verifyToken, orderController.payOrder);

module.exports = router