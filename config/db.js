const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDB = () => {
  mongoose.connect(
    process.env.DB_CONNECTION,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("Connected to DB!");
    }
  );
};
