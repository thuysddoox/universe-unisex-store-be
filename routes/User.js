const express = require("express");
const ENDPOINTS = require("../constants/endpoints");
const userController = require("../controllers/User");
const authController = require("../controllers/Auth");
const Auth = require("../middleware/Auth");
const router = express.Router();

router.get(
  ENDPOINTS.USER,
  Auth.verifyTokenAndAuthorization,
  userController.getAllUser
);
router.delete(
  ENDPOINTS.USER_DETAIL,
  Auth.verifyTokenAndAuthorization,
  userController.disableUser
  // userController.deleteUser
);
router.patch(
  ENDPOINTS.DISABLE_USER,
  Auth.verifyTokenAndAuthorization,
  userController.disableUser
);
router.patch(
  ENDPOINTS.USER_DETAIL,
  Auth.verifyToken,
  userController.updateUser
);
router.get(
  ENDPOINTS.USER_DETAIL,
  Auth.verifyToken,
  userController.getUserInfo
);
router.post(ENDPOINTS.RESET_PASSWORD, userController.resetPassword);
router.patch(ENDPOINTS.CHANGE_PASSWORD, Auth.getUserFromToken, userController.changePassword);
router.post(ENDPOINTS.CHANGE_PASSWORD, userController.changePassword);
router.post(ENDPOINTS.USER, Auth.verifyTokenAndAuthorization, authController.register);
module.exports = router;