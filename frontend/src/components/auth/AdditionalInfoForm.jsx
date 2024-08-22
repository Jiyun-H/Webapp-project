import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdditionalInfoForm = () => {
    const { userId } = useParams();
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [type, setType] = useState("");
    const [keywords, setKeywords] = useState([]);
    const [description, setDescription] = useState("");

    const navigate = useNavigate();

    const handleKeywordsChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setKeywords([...keywords, value]);
        } else {
            setKeywords(keywords.filter((keyword) => keyword !== value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            address,
            phoneNumber,
            type,
            keywords,
            description,
        };

        try {
            const response = await axios.post(
                `http://localhost:5001/api/restaurantowners/additional-info/${userId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            toast.success("Additional information updated successfully!", {
                position: "top-right",
                autoClose: 3000,
            });
            navigate(`/restaurantDashboard/${userId}`);
        } catch (error) {
            console.error("Error updating additional information:", error);
            toast.error("Failed to update additional information. Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="additional-info-container">
            <form className="additional-info-form" onSubmit={handleSubmit}>
                <h2>Provide Additional Information</h2>
                <label>Address:</label>
                <select value={address} onChange={(e) => setAddress(e.target.value)} required>
                    <option value="">Select Address</option>
                    <option value="Munich">Munich</option>
                    <option value="Berlin">Berlin</option>
                    <option value="Paris">Paris</option>
                </select>
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
                <div className="keywords">
                    {["Chinese restaurant", "German restaurant", "Korean restaurant", "Italian restaurant", "Munich", "Berlin", "Paris", "Asian", "Europe", "Hotpot", "Schweinehaxe", "Schnitzel", "BBQ", "dim sum"].map((keyword) => (
                        <label key={keyword}>
                            <input
                                type="checkbox"
                                value={keyword}
                                onChange={handleKeywordsChange}
                            />
                            {keyword}
                        </label>
                    ))}
                </div>
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AdditionalInfoForm;
