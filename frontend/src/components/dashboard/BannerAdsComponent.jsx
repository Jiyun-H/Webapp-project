import React, { useState } from "react";
import axios from "axios";
import BannerModal from "./BannerModal";
import Modal from "./Modal";
import "../../styles/dashboard/customer/BannerAdsComponent.css";
import { Paper, Button, CardContent, Typography } from "@mui/material";
import { toast } from "react-toastify";

function BannerAdsComponent({ title, banners, userId, setBanners }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAllBannersModal, setShowAllBannersModal] = useState(false);
  const [showPreviousBannersModal, setShowPreviousBannersModal] =
    useState(false);
  const [bannerData, setBannerData] = useState({
    description: "",
    imageData: "",
    startDate: "",
    endDate: "",
    adCost: 0,
  });

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSaveBanner = (newBannerData) => {
    const endDate = new Date(newBannerData.endDate);
    endDate.setHours(23, 59, 59, 999);

    axios
      .post(`http://localhost:5001/api/restaurantowners/banners/${userId}`, {
        ...newBannerData,
        endDate,
      })
      .then((response) => {
        console.log("Banner saved:", response.data);
        setBanners((prevBanners) => [...prevBanners, response.data]);
        setShowCreateModal(false);
      })
      .catch((error) => {
        console.error("Error saving banner:", error);
      });
  };

  const bannersArray = Array.isArray(banners) ? banners : [];
  const filteredArray = bannersArray.filter(
    (banner) => new Date(banner.endDate) >= new Date()
  );
  const previousBannersArray = bannersArray.filter(
    (banner) => new Date(banner.endDate) < new Date()
  );

  const handleViewAllBanners = () => {
    setShowAllBannersModal(true);
  };

  const handleViewPreviousBanners = () => {
    setShowPreviousBannersModal(true);
  };

  const handleCreateBannerClick = () => {
    if (filteredArray.length > 0) {
      const endDate = new Date(filteredArray[0].endDate);
      const message = `You already have a banner ad. You can create a new one after ${formatDate(
        endDate
      )}.`;
      toast.error(message);
    } else {
      setShowCreateModal(true);
    }
  };

  if (filteredArray.length === 0) {
    return (
      <div className="banner-card">
        <h3>{title}</h3>
        <Button
          sx={{
            backgroundColor: "#ff8c00",
            color: "#fff",
            "&:hover": {
              backgroundColor: "rgba(128, 128, 128, 1)",
            },
            alignItems: "center",
            marginLeft: "170px",
            marginTop: "40px",
          }}
          variant="contained"
          onClick={handleCreateBannerClick}
        >
          Create new banner ads
        </Button>
        <Button
          sx={{
            backgroundColor: "#ff8c00",
            color: "#fff",
            "&:hover": {
              backgroundColor: "rgba(128, 128, 128, 1)",
            },
            alignItems: "center",
            marginLeft: "175px",
            marginTop: "10px",
          }}
          variant="contained"
          onClick={handleViewAllBanners}
        >
          View every banner ads
        </Button>

        <BannerModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveBanner}
          bannerData={bannerData}
          setBannerData={setBannerData}
        />
        <Modal
          isOpen={showAllBannersModal}
          onClose={() => setShowAllBannersModal(false)}
          title="All Banners"
        >
          <div>
            {banners.map((banner, index) => (
              <div key={index}>
                <CardContent
                  sx={{
                    marginTop: "16px",

                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderRadius: "10px",
                    background: "white",
                  }}
                >
                  <div>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.primary",
                        textAlign: "left",
                        mb: "2px",
                      }}
                    >
                      Contents
                    </Typography>
                    <Typography
                      variant="h7"
                      sx={{
                        color: "text.primary",
                        textAlign: "left",
                      }}
                    >
                      {banner.description}
                    </Typography>
                    <Typography
                      sx={{
                        mt: "8px",
                        color: "text.secondary",
                        textAlign: "left",
                        fontSize: "x-small",
                      }}
                    >
                      From {formatDate(banner.startDate)} to{" "}
                      {formatDate(banner.endDate)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        textAlign: "left",
                        fontSize: "x-small",
                      }}
                    >
                      Ad Cost: ${banner.adCost}
                    </Typography>
                  </div>
                </CardContent>
              </div>
            ))}
          </div>
        </Modal>
        <Modal
          isOpen={showPreviousBannersModal}
          onClose={() => setShowPreviousBannersModal(false)}
          title="Previous Banners"
        >
          <div>
            {previousBannersArray.map((banner, index) => (
              <div key={index}>
                <CardContent
                  sx={{
                    marginTop: "16px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderRadius: "10px",
                    background: "white",
                  }}
                >
                  <div>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.primary",
                        textAlign: "left",
                        mb: "2px",
                      }}
                    >
                      Contents
                    </Typography>
                    <Typography
                      variant="h7"
                      sx={{
                        color: "text.primary",
                        textAlign: "left",
                      }}
                    >
                      {banner.description}
                    </Typography>
                    <Typography
                      sx={{
                        mt: "8px",
                        color: "text.secondary",
                        textAlign: "left",
                        fontSize: "x-small",
                      }}
                    >
                      From {formatDate(banner.startDate)} to{" "}
                      {formatDate(banner.endDate)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        textAlign: "left",
                        fontSize: "x-small",
                      }}
                    >
                      Ad Cost: ${banner.adCost}
                    </Typography>
                  </div>
                </CardContent>
              </div>
            ))}
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div>
      {filteredArray.map((banner, index) => (
        <Paper
          key={index}
          sx={{
            borderRadius: 2,
            backgroundColor: "#ff8c00",
            padding: 1,
            color: "#fff",
            textAlign: "center",
            minHeight: "184px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "24px",
            fontWeight: "bold",
          }}
          elevation={0}
        >
          <Paper
            sx={{
              borderRadius: 2,
              backgroundColor: "#fff",
              padding: 1,
              color: "#333",
              textAlign: "center",
              height: "150px",
              width: "90%",
            }}
            elevation={2}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Typography
                  variant="body2"
                  sx={{ color: "text.primary", textAlign: "left", mb: "2px" }}
                >
                  Contents
                </Typography>
                <Typography
                  variant="h7"
                  sx={{
                    color: "text.primary",
                    textAlign: "left",
                  }}
                >
                  {banner.description}
                </Typography>
                <Typography
                  sx={{
                    mt: "8px",
                    color: "text.secondary",
                    textAlign: "left",
                    fontSize: "x-small",
                  }}
                >
                  From {formatDate(banner.startDate)} to{" "}
                  {formatDate(banner.endDate)}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    textAlign: "left",
                    fontSize: "x-small",
                  }}
                ></Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    textAlign: "left",
                    fontSize: "x-small",
                  }}
                >
                  Ad Cost: ${banner.adCost}
                </Typography>
              </div>
            </CardContent>
          </Paper>
        </Paper>
      ))}
      <div className="banner-buttons-container">
        <button
          className="previous-coupons-button"
          style={{ marginTop: "10px", marginLeft: "160px" }}
          onClick={handleCreateBannerClick}
        >
          Create new banner Ad
        </button>
        <button
          className="previous-coupons-button"
          style={{ marginTop: "10px", marginLeft: "10px" }}
          onClick={handleViewPreviousBanners}
        >
          Every banner ads
        </button>
      </div>
      <BannerModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveBanner}
        bannerData={bannerData}
        setBannerData={setBannerData}
      />
      <Modal
        isOpen={showPreviousBannersModal}
        onClose={() => setShowPreviousBannersModal(false)}
        title="Previous Banners"
      >
        <div>
          {banners.map((banner, index) => (
            <div key={index}>
              <CardContent
                sx={{
                  marginTop: "16px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderRadius: "10px",
                  background: "white",
                }}
              >
                <div>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.primary",
                      textAlign: "left",
                      mb: "2px",
                    }}
                  >
                    Contents
                  </Typography>
                  <Typography
                    variant="h7"
                    sx={{
                      color: "text.primary",
                      textAlign: "left",
                    }}
                  >
                    {banner.description}
                  </Typography>
                  <Typography
                    sx={{
                      mt: "8px",
                      color: "text.secondary",
                      textAlign: "left",
                      fontSize: "x-small",
                    }}
                  >
                    From {formatDate(banner.startDate)} to{" "}
                    {formatDate(banner.endDate)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      textAlign: "left",
                      fontSize: "x-small",
                    }}
                  >
                    Ad Cost: ${banner.adCost}
                  </Typography>
                </div>
              </CardContent>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default BannerAdsComponent;
