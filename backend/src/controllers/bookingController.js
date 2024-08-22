const mongoose = require("mongoose");
const Booking = require("../models/bookingModel");
const Customer = require("../models/customerModel");
const RestaurantOwners = require("../models/restaurantOwnerModel");
const Restaurant = require("../models/restaurantModel");

const { ObjectId } = require("mongodb");

exports.addBooking = async (req, res) => {
  try {
    const {
      restaurantOwnerId,
      participants,
      date,
      time,
      customerId,
      status,
      restaurantId,
    } = req.body;

    // Validate and convert IDs to ObjectId
    // if (!ObjectId.isValid(restaurantOwnerId)) {
    //   console.error(`Invalid restaurantOwnerId: ${restaurantOwnerId}`);
    //   return res.status(400).json({ message: "Invalid restaurantOwnerId" });
    // }
    // if (!ObjectId.isValid(customerId)) {
    //   console.error(`Invalid customerId: ${customerId}`);
    //   return res.status(400).json({ message: "Invalid customerId" });
    // }

    // Find the customer to get the userId
    const customer = await Customer.findById(customerId);
    if (!customer) {
      console.error(`Customer with ID ${customerId} not found`);
      return res.status(404).json({ message: "Customer not found" });
    }
    const getcustomerId = customer.userId;

    const customerName = await Customer.findById(customerId);
    if (!customerName) {
      console.error(`Customer with ID ${customerId} not found`);
      return res.status(404).json({ message: "Customer not found" });
    }
    const getcustomerName = customer.name;

    // Find the rstaurantId to get the _Id
    // const restaurant = await Restaurant.findById(restaurantId);
    // if (!restaurant) {
    //   console.error(`Restaurant with ID ${restaurantId} not found`);
    //   return res.status(404).json({ message: "restaurant not found" });
    // }
    // const getrestaurantId = restaurant._id;

    // Find the rstaurantOwnerId to get the _Id
    const restaurantOwner = await RestaurantOwners.findById(restaurantOwnerId);
    if (!restaurantOwner) {
      console.error(`Restaurant Owner with ID ${restaurantId} not found`);
      return res.status(404).json({ message: "restaurant not found" });
    }
    const getrestaurantOwnerId = restaurantOwner.userId;
    const getrestaurantName = restaurantOwner.name;
    console.log("owner is:", getrestaurantOwnerId);

    // Create booking with customer's userId
    const bookingData = {
      restaurantOwnerId: getrestaurantOwnerId,
      restaurantName: getrestaurantName,
      participants,
      date,
      time,
      customerId: getcustomerId,
      reservationPerson: getcustomerName,
      status: status || "pending",
    };

    console.log("Converted booking data:", bookingData);

    const booking = new Booking(bookingData);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// every HTTP methods in this controller used for restaurant Owner's booking RUD action

// Get user specific bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      restaurantOwnerId: req.params.userId,
    }).sort({
      date: 1,
    });
    console.log(bookings);
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings." });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  const { bookingId, status } = req.body;
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: status },
      { new: true }
    );
    if (updatedBooking) {
      res.status(200).json({ success: true, booking: updatedBooking });
    } else {
      res.status(404).json({ success: false, message: "Booking not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating booking status." });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.body;
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    } else if (booking.status !== "pending") {
      return res.status(400).json({
        message: "Booking cannot be cancelled, as it is already processed.",
      });
    }
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "cancelled" },
      { new: true }
    );
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: "Error cancelling booking." });
  }
};
