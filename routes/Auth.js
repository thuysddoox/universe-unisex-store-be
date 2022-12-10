const express = require("express");
const ENDPOINTS = require("../constants/endpoints");
const userController = require("../controllers/Auth");
const router = express.Router();

router.post(ENDPOINTS.REGISTER, userController.register);
router.post(ENDPOINTS.LOGIN, userController.login);

module.exports = router;
