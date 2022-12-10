const express = require("express");
const ENDPOINTS = require("../constants/endpoints");
const upload = require("../utils/upload/upload");
const cloudinary = require("../utils/upload/cloudinary");
const router = express.Router();

router.post(
  ENDPOINTS.UPLOAD_MULTIPLE,
  upload.array("thumnails", 10),
  async (req, res, next) => {
    try {
      const files = req.files;
      if (files) {
        const listUrl = [];
        for (let i = 0; i < req.files.length; i++) {
          let result = await cloudinary.uploader.upload(req.files[i].path, { folder: "clothes-store" });
          listUrl.push(result.secure_url);
        }
        res.status(200).send({ responseData: { listUrl } });
      } else res.status(400).send({ message: 'Please choose file.' });
    } catch (error) {
      res.status(500).send({ message: error.message });
      next(error);
    }
  }
);
router.post(
  ENDPOINTS.UPLOAD_SINGLE,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const file = req.file;
      if (file) {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: "clothes-store" });
        res.status(200).send({ responseData: { url: result.secure_url } });
      } else res.status(400).send({ message: 'Please choose file.' });
    } catch (error) {
      res.status(500).send({ message: error.message });
      next(error);
    }
  }
);
module.exports = router;
