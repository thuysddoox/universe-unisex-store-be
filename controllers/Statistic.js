const { default: mongoose } = require("mongoose");
const Comment = require("../models/Comment");
const Order = require("../models/Order");
const User = require("../models/User");

exports.doStatistic = async (req, res, next) => {
  try {
    const query = req.query;
    const [users = 0, orders = 0, rate = 0] = await Promise.all([User.countDocuments(), Order.countDocuments(), Comment.countDocuments()]);
    const profit = await Order.aggregate([
      {
        $match: { "createdAt": { $lt: query?.to ? new Date(query?.to) : new Date(new Date().getTime() + 24 * 60 * 60 * 1000), $gt: query?.from ? new Date(query?.from) : new Date(new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000) } }
      },
      { $group: { _id: null, sum: { $sum: { $sum: ["$total", "$shipCost"] } } } },
    ])
    const stars = await Comment.aggregate([
      // {
      //   $match: { "isPaid": { $eq: true } }
      // },
      { $group: { _id: null, sum: { $sum: "$rate" } } },
    ])
    res.status(200).send({
      responseData: {
        users, orders, profit: profit[0]?.sum ?? 0, review: rate ?? 0, rate: rate > 0 ? Math.ceil(stars[0]?.sum / rate * 10) / 10 : 0
      }
    })
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
}

exports.statisticByMonth = async (req, res, next) => {
  try {
    const query = req.query;
    const data = await Order.aggregate([
      // {
      //   $match: { "isPaid": { $eq: true } }
      // },
      {
        $match: { "createdAt": { $lt: query?.to ? new Date(query?.to) : new Date(new Date().getTime() + 24 * 60 * 60 * 1000), $gt: query?.from ? new Date(query?.from) : new Date(new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000) } }
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
    res.status(200).send({ responseData: data })
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
}

exports.statisticProductOrderByMonth = async (req, res, next) => {
  try {
    const query = req.query;
    const orders = await Order.aggregate([{
      $match: {
        $and: [{ "createdAt": { $lt: query?.to ? new Date(query?.to) : new Date(new Date().getTime() + 24 * 60 * 60 * 1000), $gt: query?.from ? new Date(query?.from) : new Date(new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000) } },
        { "status": { $gt: 0 } }
        ]
      }
    }
    ])
    let data = orders.reduce((result, order) => [...result, ...order.products], []);
    let dataFinal = [];
    data.forEach(product => {
      const index = dataFinal.findIndex(item => item.productId.toString() === product.productId.toString());
      index > -1 ? dataFinal[index].quantity += product.quantity : dataFinal.push(product)
    })

    res.status(200).send({ responseData: dataFinal, total: dataFinal?.length })
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