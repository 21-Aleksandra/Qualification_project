import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../api/AuthAPI";
import FormContainer from "../../components/FormContainer/FormContainer";
import { LOGIN_ROUTE, LANDING_ROUTE } from "../../utils/routerConsts";
const PasswordResetFormPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [formState, setFormState] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const clearMessages = () => setError("");

  useEffect(() => {
    if (!token) {
      navigate(LANDING_ROUTE);
    }
  }, [navigate, token]);

  const handleInputChange = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formState.newPassword !== formState.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      console.log(formState.newPassword);
      await resetPassword(token, formState.newPassword);
      window.alert("Password reset successful!");
      navigate(LOGIN_ROUTE);
    } catch (err) {
      setError(err?.message || "Error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer
      title="Reset Password"
      fields={[
        {
          name: "newPassword",
          type: "password",
          placeholder: "New Password",
          value: formState.newPassword,
        },
        {
          name: "confirmPassword",
          type: "password",
          placeholder: "Confirm New Password",
          value: formState.confirmPassword,
        },
      ]}
      error={error}
      isLoading={isLoading}
      submitText="Reset Password"
      onSubmit={handleSubmit}
      onInputChange={handleInputChange}
      linkText="Back to Login"
      linkPath={LOGIN_ROUTE}
      clearError={clearMessages}
    />
  );
};

export default PasswordResetFormPage;
