import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ReviewStyle.css";
import Rating from "react-rating-stars-component";
import ReviewSort from "./ReviewSort";

import {UserContext} from "./auth/UserContext";
import {useNavigate} from "react-router-dom";

const Reviews = ({ restaurantOwnerId, restaurantId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: "",
    text: "",
    cost: "",
    name: "",
    images: [],
  });

  // Retrieve the customerId from local storage
  const customerId = localStorage.getItem("customerId");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [sortOptions, setSortOptions] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const url = `http://localhost:5001/reviews/user/${restaurantOwnerId}`;
        const response = await axios.get(url, { params: { ...sortOptions } });
        console.log("response", response);
        setReviews(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setReviews([]);
        } else {
          setError("Error fetching reviews");
        }
        setLoading(false);
      }
    };

    fetchReviews();
  }, [restaurantOwnerId, sortOptions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleCostChange = (e) => {
    const value = parseInt(e.target.value);
    if (/^\d*\.?\d*$/.test(value)) {
      setNewReview({ ...newReview, cost: value });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const base64Images = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    });

    Promise.all(base64Images).then((images) => {
      setNewReview({ ...newReview, images });
    });
  };

  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  const handleSortChange = (options) => {
    setSortOptions(options);
};

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user || user.role === "restaurant-owner") {
      toast.error("Please log in with the correct account!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    }

    try {
      const reviewData = {
        ...newReview,
        customerId,
        restaurantOwnerId,
        restaurantId,
        date: new Date(),
        cost: newReview.cost,
      };

      const response = await axios.post("http://localhost:5001/reviews", reviewData);
      setReviews([...reviews, response.data]);
      toast.success("Review submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setShowForm(false);
      setNewReview({
        rating: 0,
        text: "",
        cost: 0,
        name: "",
      });
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("You must have a booking at this restaurant to leave a review.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      else {
        toast.error("Failed to submit review. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
      <div className="reviews">
        <h2>Reviews</h2>
        <button className="button" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Write a Review"}
        </button>
        {showForm && (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <label>
                Name:
                <input
                    type="text"
                    name="name"
                    value={newReview.name}
                    onChange={handleInputChange}
                    required
                />
              </label>
              <label>
                Rating:
                <Rating
                    count={5}
                    size={24}
                    activeColor="#ffd700"
                    value={newReview.rating}
                    onChange={handleRatingChange}
                />
              </label>
              <label>
                Cost per Person:
                <div style={{display: "flex", alignItems: "center"}}>
                  <input
                      type="number"
                      name="cost"
                      value={newReview.cost}
                      onChange={handleCostChange}
                      style={{marginRight: "4px"}}
                      required
                  />
                  <span>€</span>
                </div>
              </label>
              <label>
                Review:
                <textarea
                    name="text"
                    value={newReview.text}
                    onChange={handleInputChange}
                    required
                ></textarea>
              </label>
              <label>
                Upload Images:
                <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />
              </label>
              <button type="submit">Submit Review</button>
            </form>
        )}
        <div className="review-list">
          <ReviewSort onSortChange={handleSortChange}/>
          {reviews.length === 0 ? (
              <div className="no-review-item">
                No reviews yet, be the first one to write a review!
              </div>
          ) : (
              reviews.map((review) => (
                  <div key={review._id} className="review-item">
                    <div className="review-content">
                      <div className="review-header">
                        <h3>{review.name}</h3>
                        <Rating
                            count={5}
                            size={24}
                            activeColor="#ffd700"
                            value={review.rating}
                            edit={false}
                        />
                      </div>
                      <div className="review-text">{review.text}</div>
                      <div className="review-details">
                        {new Date(review.date).toLocaleDateString()} ·{" "}
                        {review.cost} € per person
                      </div>
                      {review.images && review.images.length > 0 && (
                          <div className="review-images">
                            {review.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Review ${index}`}
                                    style={{maxWidth: "100%", marginTop: "10px"}}
                                />
                            ))}
                          </div>
                      )}
                    </div>
                  </div>
              ))
          )}
        </div>
      </div>
  );
};

export default Reviews;
