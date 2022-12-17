const Advertisement = require("../models/Advertisement");
exports.getAdvertisement = async (req, res, next) => {
  try {
    const ads = await Advertisement.find({})
    res.status(200).send({ responseData: ads });
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
}
exports.createAdvertisement = async (req, res, next) => {
  try {
    const ads = new Advertisement({ ...req.body })
    if (req.user.role === 2 || req.user.isAdmin) {
      await ads.save();
      res.status(200).send({ responseData: ads, message: "Update advertisement successfully!" });
    }
    else res.status(401).send({ message: "You don't allow to do that!" });
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
}

exports.updateAdvertisement = async (req, res, next) => {
  try {
    const ads = await Advertisement.findById(req.params.id);
    if (req.user.role === 2 || req.user.isAdmin && ads) {
      for (let key in ads) if (req.body[key] && key != '_id') ads[key] = req.body[key];
      await ads.save();
      res.status(200).send({ responseData: ads, message: "Update advertisement successfully!" });
    }
    else res.status(401).send({ message: "You don't allow to do that!" });
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
}

exports.deleteAdvertisement = async (req, res, next) => {
  try {
    if (req.user.role === 2 || req.user.isAdmin) {
      let ads = await Advertisement.findByIdAndDelete(req.params.id);
      res.status(200).send({ message: "Delete advertisement successfully!" });
    }
    else res.status(401).send({ message: "You don't allow to do that!" });
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
}