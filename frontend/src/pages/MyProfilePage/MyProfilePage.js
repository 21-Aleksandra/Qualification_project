import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePictureForm from "../../components/Sections/ProfileSections/ProfilePictureForm/ProfilePictureForm";
import ProfileNameForm from "../../components/Sections/ProfileSections/ProfileNameForm/ProfileNameForm";
import ProfilePasswordForm from "../../components/Sections/ProfileSections/ProfilePasswordForm/ProfilePasswordForm";
import ProfileRequestForm from "../../components/Sections/ProfileSections/ProfileRequestForm/ProfileRequestForm";
import CustomButton from "../../components/Common/CustomButton/CustomButton";
import { deleteAccount } from "../../api/ProfileAPI";
import { Context } from "../../index";
import "./MyProfilePage.css";

// user profile management page for updating profile information,
// making requests, and deleting the account.
const MyProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      try {
        await deleteAccount(user.id);
        user.logout();
        navigate("/");
      } catch (error) {
        alert("Error deleting account: " + (error?.message || " "));
      }
    }
  };

  return (
    <div>
      {/* Form to update the profile picture */}
      <ProfilePictureForm />

      {/* Form to edit the user's name */}
      <ProfileNameForm />

      {/* Form to update the user's password */}
      <ProfilePasswordForm />

      {/* Form for users to make specific requests related to their profile */}
      <ProfileRequestForm />

      {/* Button to delete the user's account */}
      <div style={{ marginTop: "100px" }}>
        <CustomButton
          onClick={handleDeleteAccount}
          size="md"
          className="delete-account-button"
        >
          Delete Account
        </CustomButton>
      </div>
    </div>
  );
};

export default MyProfilePage;
