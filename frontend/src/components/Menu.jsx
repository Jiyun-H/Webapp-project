import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Menu.css";
import { useParams } from "react-router-dom";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userId } = useParams();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const url = `http://localhost:5001/menu/user/${userId}`;
        console.log("Fetching menu items from:", url);
        const response = await axios.get(url);
        setMenuItems(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // If a 404 error is returned, set menuItems to an empty array
          setMenuItems([]);
          setLoading(false);
        } else {
          console.error("Error fetching menu items:", error);
          setError("Error fetching menu items");
          setLoading(false);
        }
      }
    };

    fetchMenuItems();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
      <div className="menu">
        <h2>Menu</h2>
        <div className="menu-items">
          {menuItems.length > 0 ? (
              menuItems.map((item) => (
                  <div key={item._id} className="menu-item">
                    <img src={item.image} alt="Menu item" />
                  </div>
              ))
          ) : (
              <div className="no-menu-items">
                This restaurant has no menu images yet, keep tracking!
              </div>
          )}
        </div>
      </div>
  );
};

export default Menu;
