import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/ResetPassword.css";

const ResetPasswordForm = () => {
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const resetToken = localStorage.getItem("resetToken");
        try {
            await axios.post(
                "http://localhost:5001/api/auth/reset-password",
                { token: resetToken, newPassword }
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
                <h2>Enter New Password</h2>
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

export default ResetPasswordForm;
