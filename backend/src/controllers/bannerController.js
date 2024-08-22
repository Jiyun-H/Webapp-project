const Banner = require("../models/bannerModel");
const RestaurantOwner = require("../models/restaurantOwnerModel");

exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ restaurantOwnerId: req.params.userId });
    res.json({ banners });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.createBanner = async (req, res) => {
  const restaurantOwnerId = req.params.userId;

  try {
    const newBanner = new Banner({
      restaurantOwnerId: restaurantOwnerId,
      description: req.body.description,
      imageData: req.body.imageData,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      adCost: req.body.adCost,
    });
    await newBanner.save();
    res.status(201).json(newBanner);
  } catch (error) {
    res.status(500).send("Error creating new Banner");
  }
};

// Route to get banner data by id for banner popup
exports.getBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.bannerId);
    if (!banner) {
      return res.status(404).send("Banner not found");
    }
    res.json(banner);
  } catch (error) {
    res.status(500).send("Error fetching banner");
  }
};

//Get every exist banner
exports.existBanner = async (req, res) => {
  try {
    const banners = await Banner.find(); // Use Banner.find() to fetch all banners
    console.log(banners);
    if (!banners.length) {
      return res.status(404).send("No banners found");
    }
    res.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).send("Error fetching banners");
  }
};

exports.getTodayBanner = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const banner = await Banner.findOne({
      startDate: { $lte: endOfDay },
      endDate: { $gte: startOfDay },
    });

    if (!banner) {
      console.log("No banner found for today.");
      return res.status(404).json({ message: "No banner found for today." });
    }

    res.json(banner);
  } catch (error) {
    console.error("Error fetching banner for today:", error);
    res.status(500).json({
      message: "Error fetching banner for today.",
      error: error.message,
    });
  }
};

//get restaurant id by banner ID

exports.getRestaurantByBannerId = async (req, res) => {
  try {
    const bannerId = req.params.id;

    const banner = await Banner.findById(bannerId);

    if (!banner) {
      return res.status(404).send("Banner not found");
    }

    const ownerId = banner.restaurantOwnerId;

    const restaurant = await RestaurantOwner.findOne({ userId: ownerId });
    console.log(restaurant);
    if (!restaurant) {
      return res.status(404).send("Restaurant not found");
    }
    console.log(restaurant._id);
    res.json({ restaurantId: restaurant._id });
  } catch (error) {
    res.status(500).send("Server error");
  }
};
