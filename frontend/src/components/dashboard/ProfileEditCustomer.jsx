import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfileEditCustomer = () => {
  //const { userId } = useParams();
  const userId = localStorage.getItem("userId");
  const [name, setName] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/customers/${userId}`
        );
        setName(response.data.name);
        setProfileImg(response.data.profileImg);
      } catch (error) {
        toast.error("Failed to fetch profile data.");
      }
    };
    fetchData();
  }, [userId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
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
      toast.success("Profile updated successfully!");
      navigate(`/customerDashboard/${userId}`);
    } catch (error) {
      toast.error("Profile update failed. Please try again.");
    }
  };

  return (
    <div className="profile-setup-container">
      <form className="profile-setup-form" onSubmit={handleSubmit}>
        <h2>Edit Your Profile</h2>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled
        />
        <label>Profile Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default ProfileEditCustomer;
