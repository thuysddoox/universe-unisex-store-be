const express = require("express");
const config = require("./config/db");
const cors = require("cors");
const AuthRoute = require("./routes/Auth");
const UploadRoute = require("./routes/Upload");
const UserRoute = require("./routes/User");
const CategoryRoute = require("./routes/Category");
const ProductRoute = require("./routes/Product");
const CartRoute = require("./routes/Cart");
const CommentRoute = require("./routes/Comment");
const WishlistRoute = require("./routes/Wishlist");
const OrderRoute = require("./routes/Order");
const PaymentRoute = require("./routes/Payment");

require("dotenv").config();

const app = express();
config.connectDB();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
    // method: ['GET','POST']
  })
);
// Routes
app.use(AuthRoute);
app.use(UploadRoute);
app.use(UserRoute);
app.use(CategoryRoute);
app.use(ProductRoute);
app.use(CartRoute);
app.use(WishlistRoute);
app.use(CommentRoute);
app.use(OrderRoute);
app.use(PaymentRoute);
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start listening to the server on PORT

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on " + process.env.PORT);
});
