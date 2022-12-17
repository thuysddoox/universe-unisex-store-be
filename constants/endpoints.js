const ENDPOINTS = {
  LOGIN: "/api/login",

  REGISTER: "/api/register",

  USER: "/api/user",
  USER_DETAIL: "/api/user/:id",
  DISABLE_USER: "/api/disable/user/:id",
  RESET_PASSWORD: "/api/reset-password",
  CHANGE_PASSWORD: "/api/change-password",

  CATEGORY: "/api/category",
  CATEGORY_DETAIL: "/api/category/:id",

  PRODUCT: "/api/product",
  PRODUCT_SALE: "/api/sale",
  PRODUCT_BEST: "/api/best-seller",
  PRODUCT_NEW: "/api/new",
  PRODUCT_DETAIL: "/api/product/:id",
  DISABLE_PRODUCT: "/api/disable/product/:id",

  COMMENT: "/api/comment",
  COMMENT_REPLY: "/api/reply/comment/:id",
  COMMENT_DETAIL: "/api/comment/:id",
  COMMENT_PRODUCT: '/api/comment/product/:id',
  COMMENT_RATE: '/api/comment/rate',
  DISABLE_COMMENT: "/api/disable/comment/:id",

  ORDER: "/api/order",
  ORDER_USER: "/api/order/user",
  ORDER_STATISTIC: "/api/order/statistic",
  ORDER_DETAIL: "/api/order/:id",
  ORDER_PAY: "/api/order/pay/:id",

  ADVERTISEMENT_DETAIL: "/api/advertisement/:id",
  ADVERTISEMENT: "/api/advertisement",

  WISHLIST: "/api/wishlist",
  WISHLIST_DETAIL: "/api/wishlist/:id",

  CART: "/api/cart",

  PAYMENT: "/api/payment",
  CHECKOUT: "/api/checkout",
  CHECKOUT_DETAIL: "/api/checkout/:id",

  UPLOAD_SINGLE: "/api/upload/single",
  UPLOAD_MULTIPLE: "/api/upload/multiple",

  STATISTIC: "/api/statistic",
  STATISTIC_MONTH: "/api/statistic/month",
  STATISTIC_USER: "/api/statistic/user/:id",
};
module.exports = ENDPOINTS;
