const { default: mongoose } = require("mongoose");
const Comment = require("../models/Comment");
const Order = require("../models/Order");
const User = require("../models/User");

exports.doStatistic = async (req, res, next) => {
  try {
    const [users = 0, orders = 0, rate = 0] = await Promise.all([User.countDocuments(), Order.countDocuments(), Comment.countDocuments()]);
    const profit = await Order.aggregate([
      // {
      //   $match: { "isPaid": { $eq: true } }
      // },
      { $group: { _id: null, sum: { $sum: { $sum: ["$total", "$shipCost"] } } } },
    ])
    const stars = await Comment.aggregate([
      // {
      //   $match: { "isPaid": { $eq: true } }
      // },
      { $group: { _id: null, sum: { $sum: "$rate" } } },
    ])
    console.log(profit, rate, stars)
    res.status(200).send({
      responseData: {
        users, orders, profit: profit[0]?.sum, review: rate, rate: rate > 0 ? Math.ceil(stars[0]?.sum / 5 * 10) / 10 : 0
      }
    })
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
}

exports.statisticByMonth = async (req, res, next) => {
  try {
    const data = await Order.aggregate([
      // {
      //   $match: { "isPaid": { $eq: true } }
      // },
      // Second Stage
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          total: {
            $sum: { $sum: ["$total", "$shipCost"] }
          },
          count: { $sum: 1 }
        }
      },
      // Third Stage
      {
        $sort: { _id: -1 }
      }
    ]);
    res.status(200).send({ responseData: data })
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
}

exports.statisticOrderByMonth = async (req, res, next) => {
  try {
    const orders = await Order.aggregate()
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
}

exports.doStatisticByUser = async (req, res, next) => {
  try {
    const data = await Order.aggregate([
      {
        $match: { "userId": { $eq: mongoose.Types.ObjectId(req.params.id) } }
      },
      // Second Stage
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          total: {
            $sum: { $sum: ["$total", "$shipCost"] }
          },
          count: { $sum: 1 }
        }
      },
      // Third Stage
      {
        $sort: { _id: -1 }
      }
    ]);
    const dataTotal = await Order.aggregate([
      {
        $match: { "userId": { $eq: mongoose.Types.ObjectId(req.params.id) } }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $sum: ["$total", "$shipCost"] }
          },
          count: { $sum: 1 }
        }
      },
    ]);
    res.status(200).send({ responseData: data, count: dataTotal[0]?.count, total: dataTotal[0]?.total })
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
}