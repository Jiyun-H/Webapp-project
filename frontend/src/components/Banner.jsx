import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Banner.css";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const [banner, setBanner] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/banners/today"
        );
        console.log(response.data);
        setBanner(response.data);
        setShowPopup(true);
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    };

    fetchBanner();
  }, []);

  if (!banner) {
    return null;
  }

  const handleImageClick = async () => {
    console.log("handle clicked ");
    try {
      const response = await axios.get(
        `http://localhost:5001/api/banners/${banner._id}/restaurant`
      );
      const { restaurantId } = response.data;
      console.log(restaurantId);
      navigate(`/${restaurantId}`);
    } catch (error) {
      console.error("Error fetching restaurant ID:", error);
    }
  };

  const closePopup = () => setShowPopup(false);

  return (
    <>
      {showPopup && (
        <div id="popup" className="popup active">
          <div className="popup-content">
            <img
              id="popupImage"
              className="popup-icon"
              src={banner.imageData}
              alt="Banner"
              onClick={handleImageClick}
            />
            <h2 id="popupTitle" className="popup-title">
              {banner.description}
            </h2>
            <button
              id="closePopup"
              className="close-popup"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;
