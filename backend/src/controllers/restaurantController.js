const Restaurant = require("../models/restaurantModel");
const mongoose = require("mongoose");

exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRestaurantDetails = async (req, res) => {
  const userId = req.params.userId;
  console.log(`Fetching restaurant details for userId: ${userId}`);
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid user ID format");
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(userId);
    console.log(`Converted userId to ObjectId: ${objectId}`);

    const restaurant = await Restaurant.findOne({ owner: objectId });
    if (!restaurant) {
      console.log("Restaurant not found");
      return res.status(404).json({ message: "Restaurant not found" });
    }
    console.log("Restaurant found:", restaurant);
    res.status(200).json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.createRestaurant = async (req, res) => {
  const restaurant = new Restaurant(req.body);
  try {
    const newRestaurant = await restaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Restaurant deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchRestaurants = async (req, res) => {
  const { term, type, sort } = req.query;

  if (!term && !type && !sort) {
    return res.status(400).json({ error: "Searching terms required" });
  }

  let query = {};

  // search by term in name or keywords
  if (term) {
    const terms = term.split(" ");
    const regexQueries = terms.map(term => ({
      $or: [
        { name: { $regex: term.trim(), $options: "i" } },
        { address: { $regex: term.trim(), $options: "i" } },
        { keywords: { $regex: term.trim(), $options: "i" } },
      ]
    }));
    query.$and = regexQueries;
  }

  // filter by type
  if (type) {
    query.type = type;
  }

  // sort by rating, price, numReviews
  let sortOption = {};
  if (sort) {
    const [key, order] = sort.split(":");
    sortOption[key] = order === "desc" ? -1 : 1;
  }

  try {
    const restaurants = await Restaurant.find(query).sort(sortOption);
    console.log("Search results:", restaurants);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//for category
exports.getChineseRestaurants = async (req, res) => {
  const { sort } = req.query;

  let sortOption = {};
  if (sort) {
    const [key, order] = sort.split(":");
    sortOption[key] = order === "desc" ? -1 : 1;
  }

  try {
    const chineseRestaurants = await Restaurant.find({ type: "Chinese" }).sort(sortOption);
    res.status(200).json(chineseRestaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGermanRestaurants = async (req, res) => {
  const { sort } = req.query;

  let sortOption = {};
  if (sort) {
    const [key, order] = sort.split(":");
    sortOption[key] = order === "desc" ? -1 : 1;
  }

  try {
    const germanRestaurants = await Restaurant.find({ type: "German" }).sort(sortOption);
    res.status(200).json(germanRestaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getKoreanRestaurants = async (req, res) => {
  const { sort } = req.query;

  let sortOption = {};
  if (sort) {
    const [key, order] = sort.split(":");
    sortOption[key] = order === "desc" ? -1 : 1;
  }

  try {
    const koreanRestaurants = await Restaurant.find({ type: "Korean" }).sort(sortOption);
    res.status(200).json(koreanRestaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getItalianRestaurants = async (req, res) => {
  const { sort } = req.query;

  let sortOption = {};
  if (sort) {
    const [key, order] = sort.split(":");
    sortOption[key] = order === "desc" ? -1 : 1;
  }

  try {
    const italianRestaurants = await Restaurant.find({ type: "Italian" }).sort(sortOption);
    res.status(200).json(italianRestaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
