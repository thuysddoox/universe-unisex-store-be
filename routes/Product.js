const express = require("express");
const ENDPOINTS = require("../constants/endpoints");
const router = express.Router();
const productController = require("../controllers/Product");
const Auth = require("../middleware/Auth");

router.get(
  ENDPOINTS.PRODUCT_DETAIL,
  productController.getProductDetail
);
router.get(
  ENDPOINTS.PRODUCT,
  productController.getProducts
);
router.get(ENDPOINTS.PRODUCT_SALE, productController.getSaleProduct);
router.get(ENDPOINTS.PRODUCT_BEST, productController.getBestSellerProduct);
router.get(ENDPOINTS.PRODUCT_NEW, productController.getNewsProduct);
router.post(
  ENDPOINTS.PRODUCT,
  Auth.verifyTokenAndAuthorization,
  productController.createProduct
);
router.patch(
  ENDPOINTS.PRODUCT_DETAIL,
  Auth.verifyTokenAndAuthorization,
  productController.editProduct
);
router.delete(
  ENDPOINTS.PRODUCT_DETAIL,
  Auth.verifyTokenAndAuthorization,
  productController.disableProduct
);
router.patch(
  ENDPOINTS.DISABLE_PRODUCT,
  Auth.verifyTokenAndAuthorization,
  productController.disableProduct
);
module.exports = router;