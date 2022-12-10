const Category = require("../models/Category");
const Comment = require("../models/Comment");
const Product = require("../models/Product");
const { APIfeatures } = require("../utils/filter");

exports.getProductDetail = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.status(200).send({
      responseData: product,
    })
    else res.status(404).send({
      message: "Product doesn't exist!"
    })
  } catch (error) {
    res.status(500).send(error);
    next(error)
  }
}

exports.getNewsProduct = async (req, res, next) => {
  try {
    const products = await Category.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "categoryId",
          as: "products",
          pipeline: [{
            '$sort': { 'createdAt': -1 },
          }],
        },
      }
    ])
    await Product.populate(products, { path: "categoryId", model: 'Category' });
    products.forEach(item => item.products = item.products.splice(0, 4));
    res.status(200).send({
      responseData: products ?? [],
    })
  } catch (error) {
    res.status(500).send(error);
    next(error)
  }
}
exports.getBestSellerProduct = async (_, res, next) => {
  try {
    const products = await Product.aggregate([{
      "$sort": {
        "sold": -1
      }
    }, { $limit: 5 }]) || await Product.aggregate([{
      "$sort": {
        "stock": 1
      }
    }, { $limit: 5 }]);
    res.status(200).send({ responseData: products ?? [], total: products?.length ?? 0 })
  } catch (error) {
    res.status(500).send(error);
    next(error)
  }
}
exports.getSaleProduct = async (req, res, next) => {
  try {
    // const products = await Product.aggregate([
    //   {
    //     $match: {
    //       discount: {
    //         $gt: 0
    //       }
    //     }
    //   }
    //   , {
    //     "$sort": {
    //       "discount": -1
    //     }
    //   }, { $limit: 5 }]);
    const features = new APIfeatures(Product.find(), req.query).paginating().getDiscount().sorting().searching();
    const products = await features.query;
    const total = await Product.countDocuments({ discount: { $gt: 0 } });
    res.status(200).send({
      responseData: products ?? [],
      page: features.queryString.pageIndex || 1,
      page_size: features.queryString.pageSize * 1 || 12,
      total: total,
    })
  } catch (error) {
    res.status(500).send(error);
    next(error)
  }
}

exports.getProducts = async (req, res, next) => {
  try {
    const features = new APIfeatures(Product.find(), req.query).paginating().sorting().searching();
    const products = await features.query;
    const total = await Product.countDocuments();
    res.status(200).send({
      responseData: products,
      page: features.queryString.pageIndex || 1,
      page_size: features.queryString.pageSize * 1 || 12,
      total: total,
    })
  } catch (error) {
    res.status(500).send(error.message);
  }
};
exports.createProduct = async (req, res, next) => {
  const newProduct = new Product(req.body);
  try {
    await newProduct.save();
    res.status(201).send({
      responseData: { product: newProduct },
      status: 201,
      message: "Created product successfully!",
    });
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
};
exports.editProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).send({ message: "Product isn't exist!" });
    } else {
      for (let key in product) if (req.body[key] && key != '_id') product[key] = req.body[key];
      await product.save();
      res
        .status(200)
        .send({ message: "Updated successfully!!!", responseData: { product } });
    }
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!product) {
      res.status(404).send({ message: "Product isn't exist!" });
    } else {
      await Comment.deleteMany({ product: req.params.id });
      res.status(200).send({ message: "Deleted successfully!!!" });
    }
  } catch (e) {
    res.status(500).send(e);
    next(e);
  }
};

exports.disableProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) req.status(404).send({ message: "Product isn't exist!" });
    else {
      product.isDisabled = !product.isDisabled;
      await product.save();
      req.status(200).send({
        message: `Product is ${product.isDisabled ? "disabled" : "enabled"
          } successfully!`,
      });
    }
  } catch (error) {
    res.status(500).send(e);
    next(e);
  }
};
