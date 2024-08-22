import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../styles/layout/Header.css";
import logo from "../../assets/logo.jpg";

import { UserContext } from "../auth/UserContext";

export default function Header() {
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const redirectToDashboard = () => {
    if (user.role === "customer") {
      navigate(`/customerDashboard/${user.userId}`);
    } else if (user.role === "restaurant-owner") {
      navigate(`/restaurantDashboard/${user.userId}`);
    }
  };

  return (
    <header>
      <div
        className="logo"
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      >
        <img src={logo} alt="Foodie Logo" />
        <div className="logo-text">
          <p>Foodie - find the best restaurant</p>
        </div>
      </div>
      <div className="auth-buttons">
        {user ? (
          <>
            <span
              onClick={redirectToDashboard}
              style={{ padding: "2px", marginRight: "10px", cursor: "pointer" }}
            >
              Hello, {user.name}
            </span>
            <button onClick={handleLogout} className="button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="button">
              Login
            </Link>
            <Link to="/register" className="button">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
