import React, { useContext, useState } from "react";
import { Context } from "../../../../index";
import { changeProfilePic } from "../../../../api/ProfileAPI";
import CustomButton from "../../../Common/CustomButton/CustomButton";
import "./ProfilePictureForm.css";

// A form for changing profile picture of the user
// It shows the preview and if user saves the photo than updates and refetches it on backend and frontn=end
// The validation is performed on backend as well
const ProfilePictureForm = () => {
  const { user } = useContext(Context);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Construct the profile picture URL based on user data or default image
  let profilePicUrl = user?.url
    ? `${process.env.REACT_APP_SERVER_URL}${user.url}`
    : require("../../../../assets/default_user_big.png");

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.size > MAX_FILE_SIZE) {
      setErrorMessage("File size should not exceed 5MB.");
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    setSelectedFile(file || null);
    setPreview(file ? URL.createObjectURL(file) : null);
    setErrorMessage("");
  };

  // avoid accidental changes
  const handleSubmit = async () => {
    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the form?"
    );
    if (!confirmSubmit) {
      return;
    }

    setIsSubmitting(true);

    try {
      const url = await changeProfilePic(user.id, selectedFile);
      alert("Profile picture updated successfully!");
      user.setUrl(url.photoUrl);
      if (selectedFile == null) {
        setPreview(null);
      }
      setSelectedFile(null);
    } catch (error) {
      alert("Error updating profile picture: " + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-picture-form">
      <div className="profile-frame">
        <img
          src={preview || profilePicUrl || ""}
          alt="Profile"
          className="profile-picture"
        />
      </div>

      <div className="warning-text">
        <p>
          <strong>Important:</strong> If you do not upload a new profile
          picture, your current profile picture will remain unchanged. If you
          wish to clear your profile picture, leave the form without selecting a
          new photo.
        </p>
        <p>
          <strong>Note:</strong> Only image files are accepted. Please make sure
          your photo is under 5MB in size.
        </p>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="form-controls">
        <input
          type="file"
          id="profile-pic-upload"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <label htmlFor="profile-pic-upload" className="upload-button">
          Add New Photo
        </label>
        <div className="button-group">
          <CustomButton
            onClick={handleSubmit}
            disabled={isSubmitting || errorMessage !== ""}
            size="md"
            className="submit-button"
          >
            {isSubmitting ? "Uploading..." : "Submit"}
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureForm;
