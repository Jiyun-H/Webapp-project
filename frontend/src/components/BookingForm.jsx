import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/BookingForm.css";

import { UserContext } from "./auth/UserContext";

const BookingForm = ({ restaurantOwnerId }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { userId } = useParams(); // Use params to get the restaurant ID
  const [formData, setFormData] = useState({
    participants: 1,
    date: "",
    hour: "",
    minute: "",
  });
  const [customerId, setCustomerId] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [hourOptions, setHourOptions] = useState([]);
  const [minuteOptions, setMinuteOptions] = useState(["00", "15", "30", "45"]);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(
            `http://localhost:5001/restaurants/user/${userId}`
        );
        const { openingTime } = response.data;
        setOpeningTime(openingTime);
        generateTimeOptions(openingTime);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
        toast.error("Error fetching restaurant details.");
      }
    };

    fetchRestaurantDetails();

    const storedCustomerId = localStorage.getItem("customerId");
    if (storedCustomerId) {
      setCustomerId(storedCustomerId);
    } else {
      console.error("No customerId found in localStorage");
    }
  }, [userId]);

  const generateTimeOptions = (openingTime) => {
    const [openingFrom, closingAt] = openingTime.split(" - ");
    const openingHour = parseInt(openingFrom.split(":")[0], 10);
    const closingHour = parseInt(closingAt.split(":")[0], 10);
    const hours = [];
    for (let hour = openingHour; hour <= closingHour; hour++) {
      hours.push(String(hour).padStart(2, "0"));
    }
    setHourOptions(hours);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role === "restaurant-owner") {
      toast.error("Please log in with the correct account!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    }

    if (!formData.date || !formData.hour || !formData.minute) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Validate booking time against opening hours
    const [openingFrom, closingAt] = openingTime.split(" - ");
    const bookingTime = `${formData.hour}:${formData.minute}`;
    if (bookingTime < openingFrom || bookingTime > closingAt) {
      toast.error(`Please select a time within the opening hours: ${openingTime}`);
      return;
    }

    const bookingData = {
      restaurantOwnerId: restaurantOwnerId,
      participants: formData.participants,
      date: formData.date,
      time: bookingTime,
      customerId: customerId,
      status: "pending",
    };

    console.log("Booking Data:", bookingData); // Log the booking data

    try {
      const response = await axios.post(
          "http://localhost:5001/api/bookings/add-booking",
          bookingData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
      );
      console.log("Booking successful:", response.data);
      toast.success("Booking successful!", {
        onClose: () => navigate("/success"),
      });
    } catch (error) {
      console.error(
          "Error submitting booking:",
          error.response ? error.response.data : error.message
      );
      toast.error("Error submitting booking");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
      <form className="booking-form" onSubmit={handleSubmit}>
        <h2>Book a Table</h2>
        <label>
          Participants: {formData.participants}
          <input
              type="range"
              name="participants"
              min="1"
              max="9"
              value={formData.participants}
              onChange={handleChange}
          />
        </label>
        <label>
          Date:
          <input
              type="date"
              name="date"
              value={formData.date}
              min={today}
              onChange={handleChange}
          />
        </label>
        <label>
          Time:
          <div className="time-select">
            <select name="hour" value={formData.hour} onChange={handleChange}>
              <option value="">Hour</option>
              {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
              ))}
            </select>
            :
            <select name="minute" value={formData.minute} onChange={handleChange}>
              <option value="">Minute</option>
              {minuteOptions.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
              ))}
            </select>
          </div>
        </label>
        <button type="submit">Submit</button>
        <ToastContainer />
      </form>
  );
};

export default BookingForm;
