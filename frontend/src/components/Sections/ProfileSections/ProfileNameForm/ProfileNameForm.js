import React, { useContext, useState } from "react";
import { Context } from "../../../../index";
import { changeName } from "../../../../api/ProfileAPI";
import CustomButton from "../../../Common/CustomButton/CustomButton";
import "./ProfileNameForm.css";

const ProfileNameForm = () => {
  const { user } = useContext(Context);
  const [newName, setNewName] = useState(user.user || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNameChange = (event) => {
    setNewName(event.target.value);
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    if (!newName.trim()) {
      setErrorMessage("Name cannot be empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      await changeName(user.id, newName);
      alert("Name updated successfully!");
      user.setUser(newName);
    } catch (error) {
      alert("Error updating name: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-name-form">
      <div className="form-frame">
        <h2>Change Name</h2>
        <input
          type="text"
          value={newName}
          onChange={handleNameChange}
          placeholder="Enter new name"
          className="name-input"
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

export default ProfileNameForm;
