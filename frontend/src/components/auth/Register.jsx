import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import '../../styles/auth/Register.css';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/register",
        {
          email,
          password,
          role,
        }
      );
      toast.success("Registration successful. Now you can login!", {
        position: "top-right",
        autoClose: 3000,
      });
      if (role === "customer") {
        navigate(`/profile-setup-customer/${response.data.userId}`);
      } else if (role === "restaurant-owner") {
        navigate(`/profile-setup-restaurant-owner/${response.data.userId}`);
      }
    } catch (error) {
      console.error(
        "Error registering:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        error.response
          ? error.response.data
          : "Registration failed. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  return (
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2>Register</h2>
          <label>Email:</label>
          <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
          />
          {error && <p className="error-message">{error}</p>}
          <label>Password:</label>
          <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="restaurant-owner">Restaurant Owner</option>
          </select>
          <button type="submit">Register</button>
        </form>
      </div>
  );
};

export default Register;
