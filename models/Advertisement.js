const mongoose = require("mongoose");

const AdvertisementSchema = new mongoose.Schema({
  banners: [
    {
      thumbnail: {
        required: false,
        type: String,
      },
      title: {
        required: false,
        type: String,
      },
      description: {
        required: false,
        type: String,
      }
    }
  ],
  video: {
    required: false,
    type: String,
  },
  sales: {
    required: false,
    type: [String],
  },
  display: {
    type: Number,
    required: false,
    default: 1,
  },
  displayOnHome: {
    type: Boolean,
    default: true,
    required: false,
  }
}, { timestamps: true });
const Advertisement = mongoose.model('Advertisement', AdvertisementSchema);
module.exports = Advertisement;