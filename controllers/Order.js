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
      order?.timeline?.push({ status: 1, date: new Date() })
      products.forEach(async (product) => {
        const p = await Product.findById(product.productId);
        p.stock -= product.quantity;
        await p.save();
      })
      const restProduct = cart.products.filter((productId) => {
        !products.includes(product => product.productId === productId)
      })
      cart.products = restProduct;
      console.log(restProduct, cart)
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
    const status = req.query?.status;
    const features = new APIfeatures(status ? Order.find({ userId: req.user._id, status: status }) : Order.find({ userId: req.user._id }), req.query).paginating().filtering().searching().sorting()
    const orders = await features.query;
    const total = await Order.countDocuments({ userId: req.user._id, status: status });
    if (orders) {
      res.status(200).send({ responseData: orders, total });
    } else {
      res.status(404).send({ responseData: orders, total, message: "You have never been ordered before!!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
exports.getTotalOrders = async (req, res, next) => {
  try {
    const result = await Order.aggregate([
      {
        $match: { "userId": { $eq: req.user._id } }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])
    res.status(200).send({ responseData: result });
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
    const order = await Order.findById(req.params.id);
    const { status } = req.body;
    if (order) {
      if (req.user.isAdmin || req.user.role === 2 && status) {
        order.status = status;
        console.log(order?.timeline)
        if (!order.timeline?.includes(item => item?.status === status)) order?.timeline?.push({ status, date: new Date() })
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
exports.updateOrderClient = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    console.log(req.user._id, order.userId)
    if (order) {
      if (req.user._id.toString() == order.userId.toString()) {
        if (!order.isPaid && order?.status === 1) {
          order.status = 0;
          const timeline = order?.timeline ?? [];
          timeline.push({ status: 0, date: new Date() })
          order.timeline = timeline;
          console.log(order)
          await order.save();
          res.status(200).send({ message: "Order has been cancelled!" });
        }
        else if (order.isPaid && order?.status === 3) {
          order.status = 4;
          const timeline = order?.timeline ?? [];
          timeline.push({ status: 4, date: new Date() })
          order.timeline = timeline;
          await order.save();
          res.status(200).send({ message: "Order has been completed!" });
        }
      }
      if (order?.isPaid) res.status(401).send({ message: "You can't cancel order because you paid!" });
    }
    else res.status(404).send({ message: "Order doesn't exist!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
    next(error)
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