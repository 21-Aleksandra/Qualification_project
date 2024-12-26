import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../../../api/ProfileAPI";
import CustomButton from "../../../Common/CustomButton/CustomButton";
import { Context } from "../../../../index";
import "./ProfilePasswordForm.css";

// ProfilePasswordForm component allows users to change their password
// The main input validation is on backend
const ProfilePasswordForm = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      // requiring all 3 inputs to make sure user wants to change his/her password
      setErrorMessage("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword(user.id, oldPassword, newPassword);
      alert("Password updated successfully!");
      user.logout();
      navigate("/"); // redirection to landing page
    } catch (error) {
      alert("Error updating password: " + error?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-password-form">
      <div className="form-frame">
        <h2>Change Password</h2>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Enter old password"
          className="password-input"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          className="password-input"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="password-input"
        />
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="form-controls">
        <div className="button-group">
          <CustomButton
            onClick={handleSubmit}
            disabled={isSubmitting || errorMessage !== ""}
            size="md"
            className="submit-button"
          >
            {isSubmitting ? "Updating..." : "Submit"}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ProfilePasswordForm;
