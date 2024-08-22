const Menu = require("../models/menuModel");
const mongoose = require("mongoose");

exports.getMenusByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const objectId = new mongoose.Types.ObjectId(userId);

    const menus = await Menu.find({ restaurantOwnerId: objectId });
    if (menus.length === 0) {
      return res.status(404).json({ message: "No menus found for this user" });
    }
    res.status(200).json(menus);
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ message: error.message });
  }
};
