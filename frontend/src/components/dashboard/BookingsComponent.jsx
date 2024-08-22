import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import "../../styles/dashboard/customer/BookingsComponent.css";

function BookingsComponent({ bookings = [] }) {
  const [showPrevious, setShowPrevious] = useState(false);
  const [bookingList, setBookingList] = useState(bookings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  useEffect(() => {
    setBookingList(bookings);
  }, [bookings]);

  const handleCancelBooking = async (bookingId) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5001/api/customers/user-cancel/${bookingId}`
      );
      if (response.status === 200) {
        const updatedBookings = bookingList.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        );
        setBookingList(updatedBookings);
        alert("Booking cancelled successfully!");
      }
    } catch (error) {
      alert("Failed to cancel the booking.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const latestBooking =
    bookingList.find((booking) => booking.status === "confirmed") ||
    bookingList.find((booking) => booking.status === "pending") ||
    bookingList[0];
  const previousBookings = bookingList.filter(
    (booking) => booking._id !== latestBooking._id
  );

  return (
    <div>
      <div className="booking-card">
        {bookingList.length === 0 ? (
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
              fontSize: "3em",
            }}
          >
            No bookings available
          </div>
        ) : (
          <div className="latest-booking">
            <div
              className="booking-details"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="booking-info">
                <span className="booking-item">
                  <strong>Date:</strong> {formatDate(latestBooking.date)}
                </span>
                <span className="booking-item">
                  <strong>Time:</strong> {latestBooking.time}
                </span>
                <span className="booking-item">
                  <strong>Participants:</strong> {latestBooking.participants}{" "}
                  people
                </span>
                <span className="booking-item">
                  <strong>Status:</strong> {latestBooking.status}
                </span>
                <span className="booking-item">
                  <strong>Location📍:</strong> {latestBooking.restaurantName}
                </span>
              </div>
              {latestBooking.status !== "cancelled" && (
                <button
                  onClick={() => handleCancelBooking(latestBooking._id)}
                  className="cancel-booking-button"
                  style={{
                    padding: "10px 20px",
                    fontSize: "1em",
                    backgroundColor: "#ff8c00",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="previous-bookings-button-container">
        {bookingList.length !== 0 && (
          <button
            className="previous-bookings-button"
            onClick={() => setShowPrevious(!showPrevious)}
          >
            See more bookings
          </button>
        )}
      </div>
      <Modal isOpen={showPrevious} onClose={() => setShowPrevious(false)}>
        <h2>Reservation details</h2>
        {previousBookings.length === 0 ? (
          <div className="no-previous-bookings">
            {" "}
            you don't have any more booking{" "}
          </div>
        ) : (
          previousBookings.map((booking, index) => (
            <div
              key={index}
              className="booking-details modal-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="booking-info">
                <span className="booking-item">
                  <strong>Date:</strong> {formatDate(booking.date)}
                </span>
                <span className="booking-item">
                  <strong>Time:</strong> {booking.time}
                </span>
                <span className="booking-item">
                  <strong>Participants:</strong> {booking.participants}
                </span>
                <span className="booking-item">
                  <strong>Status:</strong> {booking.status}
                </span>
                <span className="booking-item">
                  <strong>Restaurant Name:</strong> 📍 {booking.restaurantName}
                </span>
              </div>
              {(booking.status === "pending" ||
                booking.status === "confirmed") && (
                <button
                  onClick={() => handleCancelBooking(booking._id)}
                  className="cancel-booking-button"
                  style={{
                    padding: "10px 20px",
                    fontSize: "1em",
                    backgroundColor: "#ff8c00",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))
        )}
      </Modal>
    </div>
  );
}

export default BookingsComponent;
