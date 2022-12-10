const WishList = require("../models/WishList");

exports.getFavoriteList = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const wishlist = await WishList.findOne({ owner });
    if (wishlist) {
      res.status(200).send({ responseData: { wishlist, total: wishlist.length } });
    }
    else res.status(404).send({ responseData: { wishlist: [], total: wishlist.length }, message: "You didn't add any product into wishlist!" });
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
}
exports.handleFavorite = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const owner = req.user._id;
    const wishlist = await WishList.findOne({ owner });
    if (wishlist) {
      const productIndex = wishlist.products.findIndex(item => item === productId);
      if (productIndex > -1) wishlist.products.slice(productIndex, 1);
      else wishlist.products.push(productId);
      await wishlist.save();
      res.status(200).send({ responseData: { wishlist, total: wishlist.length }, message: `${productIndex > -1 ? 'Removed product from' : 'Add product into'} wishlist successfully!` });
    }
    else {
      const newWL = new WishList({
        owner,
        products: [productId],
      })
      await newWL.save();
      res.status(201).send({ responseData: { wishlist: newWL, total: 1 }, message: 'Create wishlist successfully!' });
    }

  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
}