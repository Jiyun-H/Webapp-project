const Category = require("../models/categoryModel");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      return res.status(200).json([]);
    }
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
