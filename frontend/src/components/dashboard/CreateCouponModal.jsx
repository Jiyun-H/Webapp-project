import React, { useState, useEffect } from "react";
import { Modal, Button, TextField, Box } from "@mui/material";

function CreateCouponModal({ isOpen, editCoupon, onClose, onSave }) {
  const [couponData, setCouponData] = useState({
    description: "",
    value: "",
    expireDate: "",
  });

  useEffect(() => {
    if (editCoupon) {
      setCouponData({
        description: editCoupon.description,
        value: editCoupon.value,
        expireDate: editCoupon.expireDate
          ? editCoupon.expireDate.slice(0, 10)
          : new Date().toISOString().substring(0, 10), // to extract ISO date
      });
    } else {
      setCouponData({
        description: "",
        value: "",
        expireDate: new Date().toISOString().substring(0, 10),
      });
    }
  }, [editCoupon]);

  const handleInputChange = (event) => {
    setCouponData({ ...couponData, [event.target.name]: event.target.value });
  };

  const handleSave = () => {
    onSave(couponData);
    onClose();
    setCouponData({
      description: "",
      value: "",
      expireDate: new Date().toISOString().substring(0, 10),
    });
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          background: "#ff8c00",
          border: "2px solid #ff8c00",
          boxShadow: 24,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: 2,
        }}
      >
        <TextField
          label="Description"
          name="description"
          value={couponData.description}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Value"
          name="value"
          type="number"
          value={couponData.value}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Expire Date"
          name="expireDate"
          type="date"
          value={couponData.expireDate}
          onChange={handleInputChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <Button
          sx={{
            backgroundColor: "rgba(128, 128, 128, 0.5)",
            color: "#fff",
            "&:hover": {
              backgroundColor: "rgba(128, 128, 128, 1)",
            },
          }}
          onClick={handleSave}
          color="primary"
          variant="contained"
        >
          Save
        </Button>
      </Box>
    </Modal>
  );
}

export default CreateCouponModal;
