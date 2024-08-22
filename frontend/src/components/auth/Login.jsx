import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "./UserContext";

import '../../styles/auth/Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { loginUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
          "http://localhost:5001/api/auth/login",
          {
            email,
            password,
          }
      );
      console.log(response.data);

      // JWT configuration -  token local storage
      const { token } = response.data;

      // const decoded = jwtDecode(token);
      const { userId, role } = jwtDecode(token);
      localStorage.setItem("token", token);

      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);

      let userDetails;
      if (role === "customer") {
        const customerResponse = await axios.get(
            `http://localhost:5001/api/customers/user/${userId}`
        );
        userDetails = customerResponse.data;
        localStorage.setItem("customerId", userDetails._id);
      } else if (role === "restaurant-owner") {
        const ownerResponse = await axios.get(
            `http://localhost:5001/api/restaurantowners/user/${userId}`
        );
        userDetails = ownerResponse.data;
      }

      const { name: userName } = userDetails;

      loginUser({ userId, role, name: userName });

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => {
        // TODO: set to mainpage here!
        if (role === "customer") {
          navigate(`/customerDashboard/${userId}`);
        } else if (role === "restaurant-owner") {
          navigate(`/restaurantDashboard/${userId}`);
        }
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <label>Email:</label>
          <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
          />
          <label>Password:</label>
          <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
          <button type="submit">Login</button>
        </form>
        <button className="forgot-password" onClick={() => navigate("/reset-password")}>
          Forgot Password?
        </button>
      </div>
  );
};

export default Login;
