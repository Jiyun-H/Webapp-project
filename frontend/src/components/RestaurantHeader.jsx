import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ShareIcon from "@mui/icons-material/Share";
import IconButton from "@mui/material/IconButton";
import "../styles/RestaurantHeader.css";
import Menu from "./Menu";
import Photos from "./Photos";
import Reviews from "./Reviews";
import BookingForm from "./BookingForm";
import Coupons from "./Coupons";

const RestaurantHeader = () => {
  const { userId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/restaurants/user/${userId}`
        );
        setRestaurant(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching restaurant details");
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() =>
        toast.success("Link copied successfully", {
          position: "top-right",
          autoClose: 3000,
        })
      )
      .catch((error) => console.error("Error copying URL:", error));
  };

  const renderSection = () => {
    switch (activeSection) {
      case "menu":
        return <Menu />;
      case "photos":
        return <Photos />;
      case "reviews":
        return (
          <Reviews
            restaurantOwnerId={restaurant.owner}
            restaurantId={restaurant._id}
          />
        );
      case "booking":
        return (
          <BookingForm
            restaurantOwnerId={restaurant.owner}
            restaurantId={restaurant._id}
          />
        );
      case "coupons":
        return (
          <Coupons
            restaurantOwnerId={restaurant.owner}
            restaurantId={restaurant._id}
          />
        );
      default:
        return (
          <div className="greeting-text">
            <h2>Welcome to {restaurant.name}!</h2>
            <p>{restaurant.description}</p>
            <p>{restaurant.type} Restaurant</p>
            <p>{restaurant.keywords.join(", ")}</p>
            <p>{restaurant.price} € per person</p>
            <p>Opening time: {restaurant.openingTime}</p>
            <p>Address: {restaurant.address}</p>
            <p>Contact: {restaurant.phoneNumber}</p>
            <p>
              Rating: {restaurant.rating} / 5 <br />
            </p>
            <p>{restaurant.numReviews} reviews</p>
          </div>
        );
    }
  };

  return (
    <div>
      <div
        className="restaurant-header"
        style={{ backgroundImage: `url(${restaurant.img})` }}
      >
        <div className="restaurant-background"></div>
        <div className="restaurant-header-content">
          <h1>{restaurant.name}</h1>
          <p>{restaurant.description}</p>
          <p>{restaurant.priceRange}</p>
          <p>Opening time: {restaurant.openingTime}</p>
          <p>Address: {restaurant.address}</p>
          <p>Contact: {restaurant.phoneNumber}</p>
          <nav>
            <ul>
              <li>
                <Link to="#" onClick={() => setActiveSection("home")}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => setActiveSection("menu")}>
                  Menu
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => setActiveSection("photos")}>
                  Photos
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => setActiveSection("reviews")}>
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => setActiveSection("booking")}>
                  Booking
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => setActiveSection("coupons")}>
                  Coupons
                </Link>
              </li>
              <li>
                <IconButton onClick={copyToClipboard} aria-label="share">
                  <ShareIcon style={{ color: "#ff6600" }} />
                </IconButton>
              </li>
            </ul>
          </nav>
        </div>
        <div className="rating-container">
          <span>
            {restaurant.rating} / 5 <br />
          </span>
          <span>{restaurant.numReviews} reviews</span>
        </div>
      </div>
      <div className="content">{renderSection()}</div>
    </div>
  );
};

export default RestaurantHeader;
