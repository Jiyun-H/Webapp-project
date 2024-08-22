import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileSetupCustomer = () => {
  const { userId } = useParams();
  //const userId = localStorage.getItem("userId");
  const [name, setName] = useState("");
  const [profileImg, setProfileImg] = useState("");

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      console.log("Base64 Image Data:", reader.result);
      setProfileImg(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting Data:", { userId, name, profileImg });
      const response = await axios.post(
        `http://localhost:5001/api/customers/profile-setup-customer/${userId}`,
        {
          name,
          profileImg,
        }
      );
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate(`/`);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Profile update failed, image is too large. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="profile-setup-container">
      <form className="profile-setup-form" onSubmit={handleSubmit}>
        <h2>Setup Your Profile</h2>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>Profile Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProfileSetupCustomer;
