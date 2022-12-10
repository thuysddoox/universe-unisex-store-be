const Order = require("../models/Order");

const stripe = require("stripe")(process.env.STRIPE_KEY);
exports.payment = async (req, res, next) => {
  try {
    stripe.charges.create(
      {
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd",
      },
      (stripeErr, stripeRes) => {
        if (stripeErr) {
          res.status(500).json(stripeErr);
        } else {
          res.status(200).send({ data: stripeRes });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.createCheckout = async (req, res, next) => {
  try {
    const products = req.body.order.products;
    const order = await Order.findById(req.body.order._id)
    const line_items = products.map(product => ({
      price_data: {
        unit_amount: product.price * 100,
        product_data: {
          name: product.productName,
          images: product.thumbnails,
          description: `${product.size} - ${product.color}`,
        },
        currency: "usd",
      },
      discounts: [
        {
          coupon: {
            percent_off: product.discount,
            currency: "usd",
          }
        }
      ],
      quantity: product.quantity,
    }))
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${process.env.WEB_BASEURL}/cart/order/success/${order._id}`,
      cancel_url: `${process.env.WEB_BASEURL}/cart/checkout`,
    });
    order.isPaid = session.payment_status !== 'unpaid';
    order.checkoutId = session.id;
    console.log(session)
    await order.save();
    res.status(200).send({ responseData: { url: session.url }, message: "Created checkout payment!!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.getCheckout = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log(session);
    res.status(200).send({ responseData: { session } });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}