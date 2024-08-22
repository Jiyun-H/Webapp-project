import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Coupons.css";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import { UserContext } from "./auth/UserContext";
import { useNavigate } from "react-router-dom";

const Coupons = ({ restaurantOwnerId, restaurantId }) => {
  const [coupons, setCoupons] = useState([]);
  const customerId = localStorage.getItem("customerId");
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/coupons/restaurant/${restaurantOwnerId}`
        );
        const validCoupons = response.data.coupons.filter(
          (coupon) => new Date(coupon.expireDate) > new Date()
        );
        setCoupons(validCoupons);
      } catch (error) {
        console.error("Error fetching coupons:", error);
        toast.error("Error fetching coupons.");
      }
    };

    fetchCoupons();
  }, [restaurantOwnerId]);

  const handleBuyCoupon = (coupon) => {
    if (!user || user.role === "restaurant-owner") {
      toast.error("Please log in with the correct account!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    }

    if (selectedCoupon && selectedCoupon._id === coupon._id) {
      setSelectedCoupon(null);
    } else {
      setSelectedCoupon(coupon);
    }
  };

  const handleFreeDownload = async (couponId) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/coupons/free-download",
        {
          customerId,
          couponId,
        }
      );
      if (response.status === 200) {
        toast.success(
          "Coupn downloaded successfully! 10 points have been deducted."
        );
        setSelectedCoupon(null);
      } else {
        toast.error("Failed to download coupon. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error during free coupon download:", error);
    }
  };

  const createOrder = async (data, actions) => {
    const response = await axios.post(
      "http://localhost:5001/api/paypal/create-order",
      { amount: selectedCoupon.value }
    );
    return response.data.id;
  };

  const onApprove = async (data, actions) => {
    const response = await axios.post(
      `http://localhost:5001/api/paypal/capture-order/${data.orderID}`
    );
    if (response.data.status === "COMPLETED") {
      await axios.post("http://localhost:5001/api/coupons/buy", {
        customerId,
        couponId: selectedCoupon._id,
      });
      toast.success("Coupon bought successfully!");
      setSelectedCoupon(null);
    } else {
      toast.error("Payment was not successful. Please try again.");
    }
  };

  return (
      <div className="coupons-section">
        <h2>Available Coupons</h2>
        {coupons.length > 0 ? (
            <ul>
              {coupons.map((coupon) => (
                  <li key={coupon._id}>
                    <div>
                      <p>{coupon.description}</p>
                      <p>Value: {coupon.value}</p>
                      <p>
                        Expires on: {new Date(coupon.expireDate).toLocaleDateString()}
                      </p>
                      {coupon.value === 0 ? (
                          <button onClick={() => handleFreeDownload(coupon._id)}>
                            Download for Free
                          </button>
                      ) : (
                          <div>
                            <button onClick={() => handleBuyCoupon(coupon)}>
                              {selectedCoupon && selectedCoupon._id === coupon._id
                                  ? "Selected"
                                  : "Buy Coupon"}
                            </button>
                            {selectedCoupon && selectedCoupon._id === coupon._id && (
                                <PayPalScriptProvider
                                    options={{
                                      "client-id":
                                          "AY8k0FIsv_4fYcIt-93GuwoEccs39KXSUGsajucKIl6-ZjGXr43RDbmEs3Tkzk_j-FP_u-a3Dua1KrKO",
                                      currency: "EUR",
                                    }}
                                >
                                  <PayPalButtons
                                      createOrder={createOrder}
                                      onApprove={onApprove}
                                  />
                                </PayPalScriptProvider>
                            )}
                          </div>
                      )}
                    </div>
                  </li>
              ))}
            </ul>
        ) : (
            <p className="no-coupon-item">No coupons available at the moment.</p>
        )}
        <ToastContainer/>
      </div>
  );
};

export default Coupons;
