const Menu = require("../models/menuModel");
const Photo = require("../models/photoModel");
const RestaurantOwners = require("../models/restaurantOwnerModel");
const Restaurant = require("../models/restaurantModel");

//update RestaurantOwner Profile
exports.updateRestaurantOwnerProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, licenseImg, profileImg, menuImgs, restaurantImgs, address, phoneNumber, type, keywords, description, openingTime } = req.body;

  console.log(`Updating profile for userId: ${userId}`);

  try {
    const owner = await RestaurantOwners.findOne({ userId });
    if (!owner) {
      console.log(`Restaurant owner with userId ${userId} not found.`);
      return res.status(404).json({ message: "Restaurant owner not found." });
    }

    console.log(`Found restaurant owner: ${owner}`);

    owner.name = name;
    owner.licenseImg = licenseImg;
    owner.profileImg = profileImg;
    owner.menuImgs = menuImgs;
    owner.restaurantImgs = restaurantImgs;

    await owner.save();

    // Save restaurant images to photos collection
    await Photo.deleteMany({
      restaurantOwnerId: owner._id,
      imageType: "restaurant",
    });
    const restaurantImageDocuments = restaurantImgs.map((image) => ({
      restaurantOwnerId: owner._id,
      image,
      imageType: "restaurant",
    }));
    await Photo.insertMany(restaurantImageDocuments);

    // Insert menu images
    await Menu.deleteMany({ restaurantOwnerId: owner._id });
    const menuImageDocuments = menuImgs.map((image) => ({
      restaurantOwnerId: owner._id,
      image,
    }));
    await Menu.insertMany(menuImageDocuments);

    // Update or create restaurant information in RestaurantLists2
    const restaurantData = {
      name,
      address,
      phoneNumber,
      type,
      keywords,
      description,
      owner: owner._id,
      img: profileImg,
      menuImgs,
      restaurantImgs,
      openingTime
    };

    await Restaurant.updateOne(
        { owner: owner._id },
        { $set: restaurantData },
        { upsert: true }
    );

    res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile.", error });
  }
};

// get specific restaurant owner profile
exports.getRestaurantOwner = async (req, res) => {
  try {
    const owner = await RestaurantOwners.findOne({ userId: req.params.userId });

    if (owner) {
      res.json(owner);
    } else {
      res.status(404).json({ message: "Restaurant owner not found." });
    }
  } catch (err) {
    console.error("Error fetching restaurant owner:", err);
    res.status(500).send(err);
  }
};
