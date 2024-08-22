const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    restaurantOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantOwner",
      required: true,
    },
    image: { type: String, required: true },
  },
  { collection: "menus" }
);

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;

