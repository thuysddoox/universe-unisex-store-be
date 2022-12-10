const multer = require("multer");
let storage = multer.diskStorage({});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|png|jpeg|JPG|PNG|JPEG|MP4)$/)) {
      return callback(new Error("please upload an image/video"));
    }
    callback(undefined, true);
  },
});

module.exports = upload;
