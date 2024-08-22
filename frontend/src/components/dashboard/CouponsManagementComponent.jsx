import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
import Modal from "./Modal";
import CreateCouponModal from "./CreateCouponModal";

function CouponsManagementComponent({ coupons, onCouponsChange, userId }) {
  const [showPrevious, setShowPrevious] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = async (couponId) => {
    try {
      await axios.delete(
        `http://localhost:5001/api/restaurantowners/coupons/${couponId}`
      );
      onCouponsChange(coupons.filter((coupon) => coupon._id !== couponId));
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  const handleCreate = () => {
    setEditCoupon(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditCoupon(null);
  };

  const handleUpdate = (coupon) => {
    setEditCoupon(coupon);
    setModalOpen(true);
  };

  const handleModalSave = (couponData) => {
    //add restaurant owenr's Id
    const couponWithUserId = { ...couponData, restaurantOwnerId: userId };
    console.log(couponWithUserId);
    const apiEndpoint = editCoupon
      ? `http://localhost:5001/api/restaurantowners/coupons/${editCoupon._id}`
      : `http://localhost:5001/api/restaurantowners/coupons`;
    const method = editCoupon ? "put" : "post";

    axios[method](apiEndpoint, couponWithUserId)
      .then((response) => {
        const newCoupons = editCoupon
          ? coupons.map((c) =>
              c._id === response.data._id ? response.data : c
            )
          : [...coupons, response.data];
        onCouponsChange(newCoupons);
        handleModalClose();
      })
      .catch((error) => {
        console.error("Error updating/creating coupon:", error);
      });
  };

  const couponsArray = Array.isArray(coupons) ? coupons : [];
  const latestCoupon = couponsArray.length > 0 ? couponsArray[0] : null;
  const previousCoupons = couponsArray.slice(1);

  return (
    <div className="coupon-management-container">
      <CreateCouponModal
        isOpen={modalOpen}
        editCoupon={editCoupon}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />

      <Card
        sx={{
          borderRadius: 2,
          backgroundColor: "#ff8c00",
          color: "#fff",
          textAlign: "center",
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "24px",
          fontWeight: "bold",
          position: "relative",
          overflow: "visible",
          width: "100%",
        }}
      >
        <Button
          sx={{
            backgroundColor: "#ff8c00",
            color: "#fff",
            position: "absolute",
            top: 16,
            right: 16,
            "&:hover": {
              backgroundColor: "rgba(128, 128, 128, 1)",
            },
          }}
          variant="contained"
          onClick={handleCreate}
        >
          Create Coupon
        </Button>

        {coupons.length > 0 && (
          <Card
            sx={{
              borderRadius: 2,
              backgroundColor: "#fff",
              padding: 1,
              color: "#333",
              textAlign: "center",
              height: "100px",
              width: "95%",
              mt: 8,
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Typography variant="h6" sx={{ color: "text.primary" }}>
                  {coupons[0].description}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", textAlign: "left" }}
                >
                  €{coupons[0].value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", textAlign: "left" }}
                >
                  Valid until: {formatDate(coupons[0].expireDate)}
                </Typography>
              </div>

              <div
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Button
                  sx={{ mb: 1 }}
                  variant="contained"
                  onClick={() => handleUpdate(coupons[0])}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ mb: 1, ml: 2 }}
                  onClick={() => handleDelete(coupons[0]._id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </Card>

      <div className="previous-coupons-button-container">
        <button
          className="previous-coupons-button"
          onClick={() => setShowPrevious(!showPrevious)}
        >
          {showPrevious ? "Hide previous coupons" : "See more coupons"}
        </button>
      </div>

      <Modal isOpen={showPrevious} onClose={() => setShowPrevious(false)}>
        <h2>All the coupons you've created</h2>
        <Card
          sx={{
            backgroundColor: "#fff",
            padding: 1,
            borderRadius: 2,

            maxWidth: "100%",
            overflow: "auto",
            margin: "auto",
            maxHeight: "80vh",
          }}
        >
          {previousCoupons.length === 0 ? (
            <div>You don't have any more coupons</div>
          ) : (
            previousCoupons.map((coupon, index) => (
              <div key={index}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #eee",
                    paddingBottom: 1,
                  }}
                >
                  <div>
                    <Typography variant="h6" sx={{ color: "text.primary" }}>
                      {coupon.description}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "text.secondary" }}
                    >
                      €{coupon.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Valid until: {formatDate(coupon.expireDate)}
                    </Typography>
                  </div>

                  <div
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <Button
                      sx={{ mb: 1 }}
                      variant="contained"
                      onClick={() => handleUpdate(coupon)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ mb: 1, ml: 2 }}
                      onClick={() => handleDelete(coupon._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </div>
            ))
          )}
        </Card>
      </Modal>
    </div>
  );
}

export default CouponsManagementComponent;
