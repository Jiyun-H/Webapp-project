import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import QRCode from "qrcode.react";
import "../../styles/dashboard/customer/CouponsComponent.css";

function CouponsComponent({ initCoupons = [] }) {
  const [coupons, setCoupons] = useState(initCoupons || []);
  const [showPrevious, setShowPrevious] = useState(false);
  const [showUseModal, setShowUseModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setCoupons(initCoupons);
  }, [initCoupons]);

  useEffect(() => {
    //console.log("Initial coupons from props:", initCoupons);
    //console.log("Coupons in Component page: ", coupons);
  }, [coupons, initCoupons]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleUseNow = (coupon) => {
    console.log("Selected coupon:", coupon);
    setSelectedCoupon(coupon);
    setShowUseModal(true);
  };

  const handleConfirmUse = () => {
    if (!selectedCoupon) return;

    const token = localStorage.getItem("token");
    axios
      .put(
        `http://localhost:5001/api/customers/coupons/used/${selectedCoupon._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Coupon marked as used successfully:", response);
        // Update the coupon as used or remove it from the state
        const updatedCoupons = coupons.map((coupon) =>
          coupon._id === selectedCoupon._id ? { ...coupon, used: true } : coupon
        );
        setCoupons(updatedCoupons);
        setShowUseModal(false);
      })
      .catch((error) => {
        console.error("Failed to mark coupon as used:", error);
      })
      .finally(() => {
        setShowUseModal(false);
      });
  };

  // Separate used and unused coupons
  const unusedCoupons = coupons.filter((coupon) => !coupon.used);
  const usedCoupons = coupons.filter((coupon) => coupon.used);
  const latestCoupon = unusedCoupons[0];
  const previousCoupons = unusedCoupons.slice(1);

  return (
    <div>
      {unusedCoupons.length === 0 && usedCoupons.length === 0 ? (
        <div style={{ textAlign: "center" }}>
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
            You don't have any coupons
          </div>
          <button
            className="previous-coupons-button"
            onClick={() => setShowAll(!showAll)}
            style={{ marginTop: "20px" }}
          >
            All coupons
          </button>
        </div>
      ) : (
        <>
          <div>
            {latestCoupon ? (
              <div className="coupon-card">
                <div className="latest-coupon">
                  <div className="coupon-details">
                    <div
                      className="coupon-info"
                      style={{ marginTop: "10px", marginBottom: "20px" }}
                    >
                      <span
                        className="coupon-description"
                        style={{
                          display: "block",
                          marginTop: "4px",
                          marginBottom: "8px",
                        }}
                      >
                        {latestCoupon.description}
                      </span>
                      <span
                        className="coupon-location"
                        style={{ display: "block", marginBottom: "2px" }}
                      >
                        📍{latestCoupon.restaurantName}
                      </span>
                      <span
                        className="coupon-expiry"
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        Valid until: {formatDate(latestCoupon.expireDate)}
                      </span>
                    </div>
                    <div
                      className="coupon-value"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span className="coupon-amount">
                        €{latestCoupon.value}
                      </span>
                      <button
                        className="coupon-use-now"
                        onClick={() => handleUseNow(latestCoupon)}
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
                        Use now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
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
                  fontSize: "2em",
                }}
              >
                You don't have any coupons now
              </div>
            )}
          </div>
          <div className="previous-coupons-button-container">
            <button
              className="previous-coupons-button"
              onClick={() => setShowPrevious(!showPrevious)}
            >
              {showPrevious ? "Hide coupons" : "More unused coupons"}
            </button>
            <button
              className="previous-coupons-button"
              onClick={() => setShowAll(!showAll)}
              style={{ marginLeft: "10px" }}
            >
              All coupons
            </button>
          </div>
        </>
      )}
      <Modal isOpen={showPrevious} onClose={() => setShowPrevious(false)}>
        <h2>More unused coupons</h2>
        {previousCoupons.length === 0 ? (
          <div>You don't have any more unused coupons</div>
        ) : (
          previousCoupons.map((coupon, index) => (
            <div key={index} className="coupon-details modal-item">
              <div
                className="coupon-info"
                style={{ marginTop: "10px", marginBottom: "20px" }}
              >
                <span
                  className="coupon-description"
                  style={{
                    display: "block",
                    marginTop: "4px",
                    marginBottom: "8px",
                  }}
                >
                  {coupon.description}
                </span>
                <span
                  className="coupon-location"
                  style={{ display: "block", marginBottom: "2px" }}
                >
                  📍{coupon.restaurantName}
                </span>
                <span
                  className="coupon-expiry"
                  style={{ display: "block", marginBottom: "4px" }}
                >
                  Valid until: {formatDate(coupon.expireDate)}
                </span>
              </div>
              <div
                className="coupon-value"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span className="coupon-amount">€{coupon.value}</span>
                <button
                  className="coupon-use-now"
                  onClick={() => handleUseNow(coupon)}
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
                  Use now
                </button>
              </div>
            </div>
          ))
        )}
      </Modal>
      <Modal isOpen={showAll} onClose={() => setShowAll(false)}>
        <h2>All Coupons</h2>
        {coupons.length === 0 ? (
          <div>You don't have coupons</div>
        ) : (
          coupons.map((coupon, index) => (
            <div key={index} className="coupon-details modal-item">
              <div
                className="coupon-info"
                style={{ marginTop: "10px", marginBottom: "20px" }}
              >
                <span
                  className="coupon-description"
                  style={{
                    display: "block",
                    marginTop: "4px",
                    marginBottom: "8px",
                  }}
                >
                  {coupon.description}
                </span>
                <span
                  className="coupon-location"
                  style={{ display: "block", marginBottom: "2px" }}
                >
                  📍{coupon.restaurantName}
                </span>
                <span
                  className="coupon-expiry"
                  style={{ display: "block", marginBottom: "4px" }}
                >
                  Valid until: {formatDate(coupon.expireDate)}
                </span>
              </div>
              <div
                className="coupon-value"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span className="coupon-amount">€{coupon.value}</span>
                {coupon.used ? (
                  <span className="coupon-used" style={{ color: "red" }}>
                    Used
                  </span>
                ) : (
                  <button
                    className="coupon-use-now"
                    onClick={() => handleUseNow(coupon)}
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
                    Use now
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </Modal>
      <Modal isOpen={showUseModal} onClose={() => setShowUseModal(false)}>
        <div style={{ textAlign: "center" }}>
          <h2>Use your coupon now!</h2>
          {selectedCoupon && (
            <div style={{ margin: "20px auto" }}>
              <QRCode
                value={`${selectedCoupon.description}|${selectedCoupon.customerId}`}
                size={128}
                level="H"
              />
            </div>
          )}
          <p>Once you click to use it, there is no going back</p>
          <button
            onClick={handleConfirmUse}
            className="previous-bookings-button"
            style={{
              margin: "10px",
              width: "auto",
              display: "inline-block",
            }}
          >
            Confirm Use
          </button>
          <button
            onClick={() => setShowUseModal(false)}
            className="previous-bookings-button"
            style={{
              margin: "10px",
              width: "auto",
              display: "inline-block",
            }}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default CouponsComponent;
