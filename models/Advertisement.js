const mongoose = require("mongoose");

const AdvertisementSchema = new mongoose.Schema({
  title1: {
    type: String,
  },
  title2: {
    type: String,
  },
  description: {
    type: String,
  },
  imgUrl: {
    type: String,
  },
}, { timestamps: true });
const Advertisement = mongoose.model('Advertisement', AdvertisementSchema);
module.exports = Advertisement;