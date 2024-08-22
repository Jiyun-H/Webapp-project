import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { Modal, TextField, Button, Box } from "@mui/material";

function BannerModal({ isOpen, onClose, onSave, bannerData, setBannerData }) {
  bannerData = bannerData || {
    description: "",
    value: "",
    expireDate: "",
    adPeriod: {},
    startDate: "",
    endDate: "",
    adCost: 0,
  };

  const [existBanners, setExistBanners] = useState([]);
  const [adCost, setAdCost] = useState(0);
  const [isPayable, setIsPayable] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchBanners = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/banners", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExistBanners(response.data || []);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBannerData((prevData) => ({ ...prevData, [name]: value }));
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate cost and validate dates
  const calculateCostAndValidateDates = () => {
    if (bannerData.startDate && bannerData.endDate) {
      const userStart = new Date(bannerData.startDate);
      const userEnd = new Date(bannerData.endDate);

      // Check if the selected period is valid (end date cannot be earlier than start date)
      if (userEnd < userStart) {
        toast.error("End date must not be earlier than start date.");
        setIsPayable(false);
        return;
      }

      // Find overlapping banners
      const overlappingBanner = (existBanners || []).find((banner) => {
        const bannerStart = new Date(banner.startDate);
        const bannerEnd = new Date(banner.endDate);
        return userStart <= bannerEnd && userEnd >= bannerStart;
      });

      if (overlappingBanner) {
        toast.error(
          `The selected date range overlaps with existing banners from ${formatDate(
            overlappingBanner.startDate
          )} to ${formatDate(overlappingBanner.endDate)}.`
        );
        setIsPayable(false);
        return;
      }

      // Calculate the cost
      const diffTime = Math.abs(userEnd - userStart);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const costPerDay = 3; // Ad cost: 3 euro per day
      const totalCost = diffDays * costPerDay;
      setAdCost(totalCost);
      setBannerData({ ...bannerData, adCost: totalCost });
      setIsPayable(true);
      toast.success(`Total Cost: €${totalCost}. Proceed to payment.`);
    }
  };

  const handleSave = () => {
    onSave(bannerData);
    onClose();
    setBannerData({
      description: "",
      value: "",
      expireDate: new Date().toISOString().substring(0, 10),
      startDate: "",
      endDate: "",
      adCost: 0,
    });
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: adCost },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      toast.success("Transaction completed", "Success");
      handleSave();
    });
  };

  const onError = (err) => {
    toast.error("Payment Failed", "Error");
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
        <h2>Create Banner Ad</h2>
        <TextField
          fullWidth
          label="Write description about your Banner ad"
          name="description"
          value={bannerData.description}
          onChange={handleInputChange}
        />
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files[0]) {
              const file = e.target.files[0];
              const reader = new FileReader();

              reader.onloadend = () => {
                setBannerData((prevData) => ({
                  ...prevData,
                  imageData: reader.result,
                }));
              };

              reader.onerror = (error) => {
                console.error("Error reading file:", error);
              };

              reader.readAsDataURL(file);
            }
          }}
        />
        <TextField
          fullWidth
          type="date"
          label="Start Date"
          name="startDate"
          value={bannerData.startDate}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          type="date"
          label="End Date"
          name="endDate"
          value={bannerData.endDate}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={calculateCostAndValidateDates}>
          Calculate Cost
        </Button>
        {adCost > 0 && <div>Total Cost: €{adCost}</div>}
        {isPayable && (
          <PayPalScriptProvider
            options={{
              clientId:
                "AY8k0FIsv_4fYcIt-93GuwoEccs39KXSUGsajucKIl6-ZjGXr43RDbmEs3Tkzk_j-FP_u-a3Dua1KrKO",
              currency: "EUR",
              intent: "capture",
            }}
          >
            <PayPalButtons
              forceReRender={[adCost]}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
            />
          </PayPalScriptProvider>
        )}
      </Box>
    </Modal>
  );
}

export default BannerModal;

/*
 Use the sandbox account to test the payment feature.
 email: jay@personal.example.com
 password: 12345678 
 */
