import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/PhotoStyle.css";

const Photos = () => {
  const [photoItems, setPhotoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchPhotoItems = async () => {
      try {
        const url = `http://localhost:5001/photo/user/${userId}`;
        console.log("Fetching photo items from:", url);
        const response = await axios.get(url);
        setPhotoItems(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // If a 404 error is returned, set photoItems to an empty array
          setPhotoItems([]);
          setLoading(false);
        } else {
          console.error("Error fetching photo items:", error);
          setError("Error fetching photo items");
          setLoading(false);
        }
      }
    };

    fetchPhotoItems();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
      <div className="photos">
        <h2>Photos</h2>
        <div className="photo-items">
          {photoItems.length > 0 ? (
              photoItems.map((item) => (
                  <div key={item._id} className="photo-item">
                    <img src={item.image} alt="Photo item" />
                  </div>
              ))
          ) : (
              <div className="no-photo-items">
                This restaurant has no photos yet, keep tracking!
              </div>
          )}
        </div>
      </div>
  );
};

export default Photos;
