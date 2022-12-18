const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.getCart = async (req, res, next) => {
  const owner = req.user._id;
  try {
    if (owner) {
      const cart = await Cart.findOne({ owner }).populate({
        path: 'products',
        populate: { path: 'product', model: 'Product' }
      });
      if (cart && cart?.products?.length > 0) {
        cart.products?.forEach((product) => {
          if (product?.product?.stock < product?.product?.quantity) product.quantity = product?.product?.stock;
        })
        await cart.save();
        console.log(cart)
      } res.status(200).send({ responseData: cart || [] });
    } else res.status(400).send({ message: "You don't allow to do that!" });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.addToCart = async (req, res, next) => {
  const owner = req.user._id;
  const { productId, quantity } = req.body;
  console.log(quantity)
  try {
    if (owner) {
      const cart = await Cart.findOne({ owner });
      const product = await Product.findOne({ _id: productId });
      if (!product) {
        res.status(404).send({ message: "Product isn't exist! " });
      }
      else {
        const price = product.price;
        if (quantity > product.stock) return res.status(401).send({ message: "Amount product in stock isn't enough!" });
        // else {
        //   product.stock -= quantity;
        //   await product.save();
        // }
        if (cart) {
          const productIndex = cart.products.findIndex(item => item.product == productId)
          if (productIndex > -1) {
            let productSelected = cart.products[productIndex];
            quantity === 1 ? productSelected.quantity += quantity : productSelected.quantity = quantity;
            cart.products[productIndex] = productSelected;
          }
          else {
            cart.products.push({
              product: productId,
              // productName,
              quantity,
              // price,
              // color,
              // size,
              // image: product.listImg[0],
            });
          }
          // cart.total = cart.products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

          await cart.save();
          await cart.populate({
            path: 'products',
            populate: { path: 'product', model: 'Product' }
          });
          res.status(200).send({ responseData: cart, messgage: 'Add to cart successfully!' })
        }
        else {
          const newCart = await Cart.create({
            owner,
            products: [
              {
                product: productId,
                // productName,
                quantity,
                // price,
                // color,
                // size,
                // image: product.listImg[0],
              },
            ],
            // total: quantity * price,
          });
          await newCart.save();
          return res.status(201).send({ responseData: newCart, message: 'Created cart successfully!' })
        }
      }
    }
    else res.status(400).send({ message: "You don't allow to do that!" });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteAllCart = async (req, res, next) => {
  try {
    const owner = req.user._id;
    let cart = await Cart.findOne({ owner });
    cart.products = [];
    await cart.save();
    res.status(201).send({ responseData: cart, message: 'Deleted all products in cart!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteFromCart = async (req, res, next) => {
  const owner = req.user._id;
  const productIds = req.body.products;
  const deleteAll = req.body.deleteAll || false;
  try {
    let cart = await Cart.findOne({ owner });
    // const product = await Product.findOne({ _id: productId });
    // if (product) {
    if (deleteAll) cart.products = [];
    else
      productIds.forEach(async (productId) => {
        const productIndex = cart.products.findIndex(
          (item) => item.product == productId
        );
        if (productIndex > -1) {
          let productSelected = cart.products[productIndex];
          cart.total -= productSelected.price * productSelected.quantity;
          cart.products.splice(productIndex, 1)(productIndex, 1);
        }
      })
    await cart.save();
    res.status(200).send({ responseData: cart, message: 'Deleted successfully!' })
    // }
    // else {
    //   res.status(404).send({ message: "Product doesn't exist! " });
    // }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
