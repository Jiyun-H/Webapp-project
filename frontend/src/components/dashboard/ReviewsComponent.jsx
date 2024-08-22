import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import "../../styles/dashboard/customer/ReviewsComponent.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function ReviewsComponent({ initReviews = [] }) {
  const [showPrevious, setShowPrevious] = useState(false);
  const [reviews, setReviews] = useState(initReviews || []);

  useEffect(() => {
    setReviews(initReviews);
  }, [initReviews]);

  const reviewsArray = Array.isArray(reviews) ? reviews : [];

  if (reviewsArray.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          marginTop: "15px",
          backgroundColor: "#ff8c00",
          borderRadius: "10px",
          color: "white",
          fontSize: "2.5em",
        }}
      >
        You don't have any reviews!
      </div>
    );
  }

  // Formatting Date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const latestReview = reviewsArray[0];
  const previousReviews = reviewsArray.slice(1);

  const { _id, date, rating, text, restaurantName } = latestReview;

  //delete review
  function ConfirmDeleteToast({ closeToast, reviewId, onConfirm }) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        Are you sure you want to delete this review?
        <span style={{ fontSize: "12px" }}>
          Deleting your review will remove the points awarded.
        </span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            className="toast-button"
            onClick={() => {
              onConfirm(reviewId);
              closeToast();
            }}
          >
            Yes
          </button>
          <button onClick={closeToast} className="toast-button">
            No
          </button>
        </div>
      </div>
    );
  }
  const token = localStorage.getItem("token");
  const customerId = localStorage.getItem("customerId");
  function deleteReview(reviewId) {
    toast(
      <ConfirmDeleteToast
        reviewId={reviewId}
        onConfirm={() => {
          const fetchDelete = async () => {
            try {
              const url = `http://localhost:5001/reviews/${reviewId}/customer/${customerId}`;
              const response = await axios.delete(url, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              console.log("response", response);
              console.log("Review deleted:", response.data);
              toast.success("Review deleted successfully");
              setReviews(reviews.filter((review) => review._id !== reviewId));
            } catch (error) {
              console.error("Error:", error);
              // If user's point is under 50 then show error message (user cannot delete review)
              if (error.response && error.response.data.message) {
                toast.error(error.response.data.message);
              } else {
                toast.error("Error deleting review");
              }
            }
          };
          fetchDelete();
        }}
      />,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
      }
    );
  }

  return (
    <div>
      <div className="review-card" style={{ fontSize: "1.2em" }}>
        <div className="latest-review">
          <div
            className="review-details"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="review-info" style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  className="review-rating"
                  style={{ alignSelf: "flex-start" }}
                >
                  {"⭐".repeat(rating)}
                </div>{" "}
                <div
                  className="review-location"
                  style={{
                    alignSelf: "flex-end",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  📍 {restaurantName}
                </div>
              </div>
              <div
                className="review-text"
                style={{ fontSize: "20px", marginBottom: "8px" }}
              >
                {text}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="review-date">{formatDate(date)}</div>{" "}
                  {/* detele button */}
                  <div key={_id}>
                    <button
                      className="review-delete-button"
                      onClick={() => deleteReview(_id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div
                  className="review-points"
                  style={{ alignSelf: "flex-end" }}
                >
                  +50P
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="previous-reviews-button-container">
        <button
          className="previous-reviews-button"
          onClick={() => setShowPrevious(!showPrevious)}
        >
          See previous reviews
        </button>
      </div>
      <Modal isOpen={showPrevious} onClose={() => setShowPrevious(false)}>
        <h2>Previous Reviews</h2>
        {previousReviews.length === 0 ? (
          <div>No previous reviews</div>
        ) : (
          previousReviews.map((review, index) => (
            <div
              key={index}
              className="review-details modal-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="review-info" style={{ width: "100%" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    className="review-rating"
                    style={{ alignSelf: "flex-start" }}
                  >
                    {"⭐".repeat(review.rating)}
                  </div>
                  <div
                    className="review-location"
                    style={{
                      alignSelf: "flex-end",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    📍 {review.restaurantName}
                  </div>
                </div>
                <div
                  className="review-text"
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    marginBottom: "8px",
                  }}
                >
                  {review.text}
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="review-date">{formatDate(review.date)}</div>
                    {/* detele button */}
                    <div key={review._id}>
                      <button
                        className="review-delete-button"
                        style={{ alignSelf: "flex-end" }}
                        onClick={() => deleteReview(review._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div
                    className="review-points"
                    style={{ alignSelf: "flex-end" }}
                  >
                    +50P
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </Modal>
    </div>
  );
}

export default ReviewsComponent;
