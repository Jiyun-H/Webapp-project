import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/ResetPassword.css";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:5001/api/auth/request-reset-password",
                { email, newPassword }
            );
            toast.success("Password reset successful!", {
                position: "top-right",
                autoClose: 3000,
            });
            navigate("/login");
        } catch (error) {
            console.error(error);
            toast.error("Failed to reset password. Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="reset-password-container">
            <form className="reset-password-form" onSubmit={handleResetPassword}>
                <h2>Reset Password</h2>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label>New Password:</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
