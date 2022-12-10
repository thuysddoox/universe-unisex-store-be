const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { APIfeatures } = require("../utils/filter");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const getTotal = (products) => {
  return products.reduce((prev, curr) => {
    return prev + curr.quantity * curr.price;
  }, 0);
};
exports.createOrder = async (req, res, next) => {
  const { fullname, address, phone, email, products } = req.body;
  try {
    const cart = await Cart.findOne({ owner: req.user._id });
    if (!fullname || !address || !phone || !email) {
      return res.status(400).send({ message: "Please provide full field!" });
    } else {
      const order = new Order({ ...req.body, userId: req.user._id });
      products.forEach(async (product) => {
        const p = await Product.findById(product.productId);
        p.stock -= product.quantity;
        await p.save();
      })
      const restProduct = cart.products.filter(async (productId) => {
        !products.includes(product => product.productId === productId)
      })
      console.log(restProduct)
      cart.products = restProduct;
      await cart.save();
      await order.save();
      return res.status(201).send({ responseData: order, message: "Ordered successfully!!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    if (orders) {
      res.status(200).send({ responseData: { orders }, total: orders.length });
    } else {
      res.status(404).send({ responseData: { orders: [] }, total: 0, message: "You have never been ordered before!!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
exports.getOrderDetail = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    if (order && order.userId === req.user._id) {
      res.status(200).send({ responseData: { order } });
    } else {
      res.status(404).send({ message: "Order doesn't exist!!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    const { status } = req.body;
    if (order) {
      if (req.user.isAdmin || req.user.role === 2 && status) {
        order.status = status;
        await order.save();
        res.status(200).send({ responseData: { order }, message: "Updated successfully!" });
      }
      else res.status(401).send({ message: "You can't do that!" });
    }
    else res.status(404).send({ message: "Order doesn't exist!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (order && req.user._id === order.userId && !order.isPaid) {
      order.status = 0;
      await order.save();
    }
    else if (order.isPaid) res.status(401).send({ message: "You can't cancel order because you paid!" });
    else res.status(404).send({ message: "Order doesn't exist!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
exports.getAllOrders = async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      const features = new APIfeatures(Order.find(), req.query).paginating().sorting().searching();
      const orders = await features.query;
      const total = await Order.countDocuments();
      res.status(200).send({
        responseData: orders,
        page: features.queryString.pageIndex || 1,
        page_size: features.queryString.pageSize * 1 || 12,
        total: total,
      });
    }
    else {
      res.status(401).send({ message: "You don't allow to do that!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.payOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ checkoutId: req.body.checkoutId });
    const session = await stripe.checkout.sessions.retrieve(checkoutId);
    if (order) {
      if (req.user) {
        if (session.payment_status === 'paid') order.isPaid = true;
        await order.save();
        res.status(200).send({ responseData: { paid: true }, message: "Order is paid successfully!" });
      }
      else res.status(401).send({ message: "You can't do that!" });
    }
    else res.status(404).send({ message: "Order doesn't exist!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};