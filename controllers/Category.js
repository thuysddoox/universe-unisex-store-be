const Category = require("../models/Category");
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).send({
      responseData: categories
    });
  } catch (error) {
    res.status(500).json(error);
    next(error);
  }
};
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    if (!category) res.status(404).send({ message: "Category isn't exist!" });
    for (let key in category) if (req.body[key] && key != '_id') category[key] = req.body[key];
    console.log(req.body)
    await category.save();
    res.status(200).send({
      responseData: category
    });
  } catch (error) {
    res.status(500).json(error);
    next(error);
  }
};
