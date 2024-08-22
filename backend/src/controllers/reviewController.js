const Review = require("../models/reviewModel");
const mongoose = require("mongoose");
const RestaurantOwners = require("../models/restaurantOwnerModel");
const Customer = require("../models/customerModel");
const Restaurant = require("../models/restaurantModel");

const Booking = require("../models/bookingModel");

exports.getReviews = async (req, res) => {
  const reviews = await Review.find();
  res.json(reviews);
};

// add review
exports.addReview = async (req, res) => {
  try {
    const {
      customerId,
      restaurantOwnerId,
      restaurantId,
      rating,
      text,
      cost,
      name,
      images,
    } = req.body;

    // Find the customer to get the userId
    const customer = await Customer.findById(customerId);
    if (!customer) {
      console.error(`Customer with ID ${customerId} not found`);
      return res.status(404).json({ message: "Customer not found" });
    }
    const userId = customer.userId;

    // Find the rstaurantOwnerId to get the _Id
    const restaurantOwner = await RestaurantOwners.findById(restaurantOwnerId);
    if (!restaurantOwner) {
      console.error(`Restaurant Owner with ID ${restaurantId} not found`);
      return res.status(404).json({ message: "restaurant not found" });
    }

    const owner = await RestaurantOwners.findOne({ _id: restaurantOwnerId });
    if (!owner) {
      return res.status(404).json({ message: "Restaurant owner not found." });
    }

    // console.log(owner.)

    const booking = await Booking.findOne({
      customerId: userId,
      restaurantOwnerId: owner.userId,
      // status: "finished"
    });

    if (!booking) {
      return res.status(403).json({ message: "You must have a confirmed booking at this restaurant to leave a review." });
    }

    const getrestaurantName = restaurantOwner.name;

    // Create the review with customer's userId
    const newReview = new Review({
      customerId: userId,
      restaurantName: getrestaurantName,
      restaurantOwnerId,
      restaurantId,
      rating,
      text,
      cost,
      name,
      date: new Date(),
      images,
    });

    // create new review
    await newReview.save();
    console.log("Review created with Customer userId:", userId);

    //update points
    customer.point += 50;
    await customer.save();
    console.log(
      `Customer ${customerId} rewarded with 50 points. Total points: ${customer.point}`
    );

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// get reviews by restaurantId
exports.getReviewsByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    //Sort reviews
    const { sort } = req.query;
    let sortOption = {};
    if (sort) {
      const [key, order] = sort.split(":");
      sortOption[key] = order === "desc" ? -1 : 1;
    }

    const reviews = await Review.find({ restaurantOwnerId: objectId }).sort(
      sortOption
    );

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this user" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: error.message });
  }
};

// delete review
exports.deleteReviewById = async (req, res) => {
  const { reviewId, customerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return res.status(400).json({ message: "Invalid review ID format" });
  }

  const customer = await Customer.findById(customerId);
  if (!customer) {
    console.error(`Customer with ID ${customerId} not found`);
    return res.status(404).json({ message: "Customer not found" });
  }
  //check user has valid point
  if (customer.point < 50) {
    return res
      .status(400)
      .json({ message: "Not enough points to delete review" });
  }

  try {
    const result = await Review.findByIdAndDelete(reviewId);
    if (result) {
      // update points
      customer.point -= 50;
      await customer.save();
      console.log(
        `Deducted 50 points for customer ${customerId}. Total points: ${customer.point}`
      );
      res.status(200).json({ message: "Review deleted successfully" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update restaurant metrics
async function updateRestaurantMetrics() {
  try {
    // Aggregate Reviews
    const aggregatedReviews = await Review.aggregate([
      {
        $group: {
          _id: "$restaurantId", // Group by restaurantId
          averageRating: { $avg: "$rating" },
          numReviews: { $sum: 1 },
          averageCost: { $avg: "$cost" },
        },
      },
    ]);

    // Update Restaurant Document
    for (const review of aggregatedReviews) {
      const priceRange = calculatePriceRange(
        review.averageCost,
        review.numReviews
      );

      await Restaurant.findByIdAndUpdate(review._id, {
        rating: review.averageRating.toFixed(1),
        numReviews: review.numReviews,
        price: parseInt(review.averageCost, 10),
        priceRange: priceRange,
      });
    }

    console.log("Restaurant metrics updated successfully.");
  } catch (error) {
    console.error("Error updating restaurant metrics:", error);
  }
}
updateRestaurantMetrics();

// Function to listen for changes in the reviews collection
async function listenForReviewChanges() {
  const reviewChangeStream = Review.watch();

  reviewChangeStream.on("change", async (change) => {
    if (
      ["insert", "update", "replace", "delete"].includes(change.operationType)
    ) {
      await updateRestaurantMetrics();
    }
  });
}
// Start listening for review changes
listenForReviewChanges();

function calculatePriceRange(averageCost, numReviews) {
  let totalCost = averageCost * numReviews;

  if (averageCost <= 10) {
    return (totalCost + 5) / (numReviews + 1) > 10 ? "€10-20" : "€0-10";
  } else if (averageCost <= 20) {
    if ((totalCost + 15) / (numReviews + 1) > 20) {
      return "€20-30";
    } else if ((totalCost + 15) / (numReviews + 1) < 10) {
      return "€0-10";
    } else {
      return "€10-20";
    }
  } else if (averageCost <= 30) {
    if ((totalCost + 25) / (numReviews + 1) > 30) {
      return "€30-40";
    } else if ((totalCost + 15) / (numReviews + 1) < 20) {
      return "€10-20";
    } else {
      return "€20-30";
    }
  } else if (averageCost <= 40) {
    if ((totalCost + 35) / (numReviews + 1) > 40) {
      return "€40+";
    } else if ((totalCost + 15) / (numReviews + 1) < 30) {
      return "€20-30";
    } else {
      return "€30-40";
    }
  } else {
    return (totalCost + 15) / (numReviews + 1) < 40 ? "€30-40" : "€40+";
  }
}
