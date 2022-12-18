const express = require('express');
const ENDPOINTS = require('../constants/endpoints');
const paymentController = require("../controllers/Payment");
const Auth = require("../middleware/Auth");
const router = express.Router();
router.post(ENDPOINTS.PAYMENT, Auth.verifyToken, paymentController.payment)
router.post(ENDPOINTS.CHECKOUT, Auth.verifyToken, paymentController.createCheckout)
router.get(ENDPOINTS.CHECKOUT_DETAIL, Auth.verifyToken, paymentController.getCheckout)
router.get(ENDPOINTS.ORDER_PAY, Auth.verifyToken, paymentController.payOrder)

module.exports = router;