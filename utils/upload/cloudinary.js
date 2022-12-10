// const cloudinary = require("cloudinary").v2;
// const multer = require("multer");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
// const storage = new CloudinaryStorage({
//   cloudinary,
//   allowedFormats: ["jpg", "png"],
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const uploadCloudinary = multer({ storage });

// module.exports = uploadCloudinary;

const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
