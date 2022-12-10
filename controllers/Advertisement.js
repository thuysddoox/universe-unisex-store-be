const Advertisement = require("../models/Advertisement");

exports.createAdvertisement = async (req, res, next) => {
  try {
    const ad = req.body;
    const ads = await Advertisement.find();
    if (req.user.role === 2 || req.user.isAdmin) {
      ads[0] = { ...ads[0], ...ad };
      await ads.save();
      res.status(200).send({ data: { advertisement: ads[0] }, message: "Update advertisement successfully!" });
    }
    else res.status(401).send({ message: "You don't allow to do that!" });
  } catch (error) {
    res.status(500).send(error);
    next(error);
  }
}