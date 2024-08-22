import React from "react";
import "../../styles/layout/Footer.css";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import logo from "../../assets/logo.jpg";


export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <img src={logo} alt="Food Logo" className="food-logo"/>
        <p>Foodie - find the best restaurant</p>
      </div>
      <div className="footer-links">
        <div className="footer-links-row">
          <a href="/contact">Contact Us</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
        <div className="footer-links-row">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <FaYoutube />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
            <FaTiktok />
          </a>
        </div>
      </div>
    </footer>
  );
}

