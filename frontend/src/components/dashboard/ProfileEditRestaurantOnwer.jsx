import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Select from "react-select";

import "../../styles/auth/ProfileSetupRestaurantOwner.css";

const keywordOptions = [
  { value: "Chinese restaurant", label: "Chinese restaurant" },
  { value: "German restaurant", label: "German restaurant" },
  { value: "Korean restaurant", label: "Korean restaurant" },
  { value: "Italian restaurant", label: "Italian restaurant" },
  { value: "Munich", label: "Munich" },
  { value: "Berlin", label: "Berlin" },
  { value: "Paris", label: "Paris" },
  { value: "Asian", label: "Asian" },
  { value: "Europe", label: "Europe" },
  { value: "Hotpot", label: "Hotpot" },
  { value: "Schweinehaxe", label: "Schweinehaxe" },
  { value: "Schnitzel", label: "Schnitzel" },
  { value: "BBQ", label: "BBQ" },
  { value: "dim sum", label: "dim sum" },
  { value: "Sushi", label: "Sushi" },
  { value: "Ramen", label: "Ramen" },
  { value: "Udon", label: "Udon" },
  { value: "Tempura", label: "Tempura" },
  { value: "Yakitori", label: "Yakitori" },
  { value: "Sashimi", label: "Sashimi" },
  { value: "Tapas", label: "Tapas" },
  { value: "Paella", label: "Paella" },
  { value: "Tacos", label: "Tacos" },
  { value: "Burritos", label: "Burritos" },
  { value: "Quesadillas", label: "Quesadillas" },
  { value: "Fajitas", label: "Fajitas" },
  { value: "Enchiladas", label: "Enchiladas" },
  { value: "Nachos", label: "Nachos" },
  { value: "Guacamole", label: "Guacamole" },
  { value: "Pasta", label: "Pasta" },
  { value: "Pizza", label: "Pizza" },
  { value: "Lasagna", label: "Lasagna" },
  { value: "Risotto", label: "Risotto" },
  { value: "Gnocchi", label: "Gnocchi" },
  { value: "Bruschetta", label: "Bruschetta" },
  { value: "Tiramisu", label: "Tiramisu" },
  { value: "Gelato", label: "Gelato" },
  { value: "Panini", label: "Panini" },
  { value: "Baguette", label: "Baguette" },
  { value: "Croissant", label: "Croissant" },
  { value: "Macarons", label: "Macarons" },
  { value: "Crepes", label: "Crepes" },
  { value: "Souffle", label: "Souffle" },
  { value: "Fondue", label: "Fondue" },
  { value: "Raclette", label: "Raclette" },
  { value: "Quiche", label: "Quiche" },
  { value: "Boeuf Bourguignon", label: "Boeuf Bourguignon" },
  { value: "Coq au Vin", label: "Coq au Vin" },
  { value: "Cassoulet", label: "Cassoulet" },
  { value: "Bouillabaisse", label: "Bouillabaisse" },
  { value: "Foie Gras", label: "Foie Gras" },
  { value: "Escargot", label: "Escargot" },
  { value: "Ratatouille", label: "Ratatouille" },
  { value: "Peking Duck", label: "Peking Duck" },
  { value: "Kung Pao Chicken", label: "Kung Pao Chicken" },
  { value: "Sweet and Sour Pork", label: "Sweet and Sour Pork" },
  { value: "Ma Po Tofu", label: "Ma Po Tofu" },
  { value: "Chow Mein", label: "Chow Mein" },
  { value: "Spring Rolls", label: "Spring Rolls" },
  { value: "Dumplings", label: "Dumplings" },
  { value: "Wonton Soup", label: "Wonton Soup" },
  { value: "Fried Rice", label: "Fried Rice" },
  { value: "Bibimbap", label: "Bibimbap" },
  { value: "Kimchi", label: "Kimchi" },
  { value: "Bulgogi", label: "Bulgogi" },
  { value: "Japchae", label: "Japchae" },
  { value: "Galbi", label: "Galbi" },
  { value: "Sundubu Jjigae", label: "Sundubu Jjigae" },
  { value: "Samgyeopsal", label: "Samgyeopsal" },
  { value: "Gimbap", label: "Gimbap" },
  { value: "Tofu Soup", label: "Tofu Soup" },
  { value: "Pho", label: "Pho" },
  { value: "Banh Mi", label: "Banh Mi" },
  { value: "Rice Paper Rolls", label: "Rice Paper Rolls" },
  { value: "Vermicelli", label: "Vermicelli" },
  { value: "Satay", label: "Satay" },
  { value: "Laksa", label: "Laksa" },
  { value: "Char Kway Teow", label: "Char Kway Teow" },
  { value: "Hainanese Chicken Rice", label: "Hainanese Chicken Rice" },
  { value: "Nasi Lemak", label: "Nasi Lemak" },
  { value: "Roti Canai", label: "Roti Canai" },
  { value: "Pad Thai", label: "Pad Thai" },
  { value: "Tom Yum Soup", label: "Tom Yum Soup" },
  { value: "Green Curry", label: "Green Curry" },
  { value: "Red Curry", label: "Red Curry" },
  { value: "Massaman Curry", label: "Massaman Curry" },
  { value: "Som Tum", label: "Som Tum" },
  { value: "Mango Sticky Rice", label: "Mango Sticky Rice" },
  { value: "Tandoori Chicken", label: "Tandoori Chicken" },
  { value: "Butter Chicken", label: "Butter Chicken" },
  { value: "Biryani", label: "Biryani" },
  { value: "Paneer Tikka", label: "Paneer Tikka" },
  { value: "Naan", label: "Naan" },
  { value: "Samosa", label: "Samosa" },
  { value: "Chaat", label: "Chaat" },
  { value: "Gulab Jamun", label: "Gulab Jamun" },
  { value: "Jalebi", label: "Jalebi" },
  { value: "Falafel", label: "Falafel" },
  { value: "Hummus", label: "Hummus" },
  { value: "Shawarma", label: "Shawarma" },
  { value: "Tabbouleh", label: "Tabbouleh" },
  { value: "Baklava", label: "Baklava" },
  { value: "Dolma", label: "Dolma" },
  { value: "Kebab", label: "Kebab" },
  { value: "Moussaka", label: "Moussaka" },
];

const ProfileSetupRestaurantOwner = () => {
  const userId = localStorage.getItem("userId");
  const [name, setName] = useState("");
  const [licenseImg, setLicenseImg] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [menuImgs, setMenuImgs] = useState([]);
  const [restaurantImgs, setRestaurantImgs] = useState([]);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [type, setType] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [description, setDescription] = useState("");
  const [openingFrom, setOpeningFrom] = useState("");
  const [closingAt, setClosingAt] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/restaurantowners/${userId}`
        );
        const data = response.data;

        setName(data.name || "");
        setLicenseImg(data.licenseImg || "");
        setProfileImg(data.profileImg || "");
        setMenuImgs(data.menuImgs || []);
        setRestaurantImgs(data.restaurantImgs || []);
        setAddress(data.address || "");
        setPhoneNumber(data.phoneNumber || "");
        setType(data.type || "");
        setKeywords(data.keywords || []);
        setDescription(data.description || "");
        if (data.openingTime) {
          const [from, to] = data.openingTime.split(" - ");
          setOpeningFrom(from || "");
          setClosingAt(to || "");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Error fetching profile data.");
      }
    };

    fetchProfileData();
  }, [userId]);

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleImageChange = (e, setImages) => {
    const files = Array.from(e.target.files);
    const readers = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return reader;
    });

    Promise.all(
      readers.map(
        (reader) =>
          new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
          })
      )
    ).then((results) => {
      setImages(results);
    });
  };

  const handleKeywordsChange = (selectedOptions) => {
    setKeywords(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const openingTime = `${openingFrom} - ${closingAt}`;
    const formData = {
      name,
      licenseImg,
      profileImg,
      menuImgs,
      restaurantImgs,
      address,
      phoneNumber,
      type,
      keywords,
      description,
      openingTime,
    };

    console.log("Submitting Data:", { userId, ...formData });

    try {
      const response = await axios.post(
        `http://localhost:5001/api/restaurantowners/profile-setup-restaurant-owner/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate(`/restaurantDashboard/${userId}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Profile update failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="profile-setup-container">
      <form className="profile-setup-form" onSubmit={handleSubmit}>
        <h2>Setup Your Restaurant Profile</h2>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled
          required
        />
        <label>License Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e, setLicenseImg)}
          disabled
          required
        />
        {licenseImg && (
          <img src={licenseImg} alt="License" className="image-preview" />
        )}
        <label>Profile Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e, setProfileImg)}
          required
        />
        {profileImg && (
          <img src={profileImg} alt="Profile" className="image-preview" />
        )}
        <label>Menu Images:</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleMultipleImageChange(e, setMenuImgs)}
          required
        />
        {menuImgs.length > 0 && (
          <div className="image-preview">
            {menuImgs.map((img, index) => (
              <img key={index} src={img} alt={`Menu ${index + 1}`} />
            ))}
          </div>
        )}
        <label>Restaurant Images:</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleMultipleImageChange(e, setRestaurantImgs)}
          required
        />
        {restaurantImgs.length > 0 && (
          <div className="image-preview">
            {restaurantImgs.map((img, index) => (
              <img key={index} src={img} alt={`Restaurant ${index + 1}`} />
            ))}
          </div>
        )}
        <label>Address:</label>
        <input
        type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <label>Phone Number:</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <label>Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="">Select Type</option>
          <option value="Chinese">Chinese</option>
          <option value="Asian">Asian</option>
          <option value="German">German</option>
          <option value="Korean">Korean</option>
          <option value="Italian">Italian</option>
        </select>
        <label>Keywords:</label>
        <Select
          isMulti
          value={keywordOptions.filter((option) =>
            keywords.includes(option.value)
          )}
          onChange={handleKeywordsChange}
          options={keywordOptions}
          className="basic-multi-select"
          classNamePrefix="select"
        />
        <label>Opening From:</label>
        <input
          type="time"
          value={openingFrom}
          onChange={(e) => setOpeningFrom(e.target.value)}
          required
        />
        <label>Closed At:</label>
        <input
          type="time"
          value={closingAt}
          onChange={(e) => setClosingAt(e.target.value)}
          required
        />
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ProfileSetupRestaurantOwner;
