const mongoose = require("mongoose");
const Photo = require("../models/photoModel");

exports.getPhotosByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    const photos = await Photo.find({ restaurantOwnerId: objectId });
    if (photos.length === 0) {
      return res.status(404).json({ message: "No photos found for this user" });
    }
    res.status(200).json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ message: error.message });
  }
};
