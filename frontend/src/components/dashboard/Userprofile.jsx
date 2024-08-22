import React from "react";
import { useNavigate } from "react-router-dom";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

import "../../styles/dashboard/UserProfile.css";

export default function UserProfile({ user = [] }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleEditProfile = () => {
    // check user role and redirect to proper profile edit page
    if (role === "customer") {
      navigate(`/customerDashboard/profile-edit/${user._id}`);
    } else if (role === "restaurant-owner") {
      navigate(`/restaurantDashboard/profile-edit/${user._id}`);
    }
  };

  return (
    <div className="user-profile">
      <img
        className="profile-img"
        src={user.profileImg}
        alt={`${user.name}'s Profile`}
      />
      <ModeEditIcon className="edit-icon" onClick={handleEditProfile} />
      <div className="info">
        <h2>Hello, {user.name}</h2>
        <p>{user.email}</p>
      </div>
    </div>
  );
}
