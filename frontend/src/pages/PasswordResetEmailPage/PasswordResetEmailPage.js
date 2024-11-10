import React, { useState } from "react";
import { requestPasswordReset } from "../../api/AuthAPI";
import { useNavigate } from "react-router-dom";
import FormContainer from "../../components/FormContainer/FormContainer";
import { LOGIN_ROUTE } from "../../utils/routerConsts";

const PasswordResetEmailPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const clearMessages = () => setError("");
  const handleInputChange = (name, value) => {
    if (name === "email") setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      window.alert("Password reset email sent! Please check your inbox.");
      navigate(LOGIN_ROUTE);
    } catch (err) {
      setError(err?.message || "Error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer
      title="Password Reset"
      fields={[
        {
          name: "email",
          type: "email",
          placeholder: "Enter your email",
          value: email,
        },
      ]}
      error={error}
      isLoading={isLoading}
      submitText="Send Reset Email"
      onSubmit={handleSubmit}
      onInputChange={handleInputChange}
      linkText="Back to Login"
      linkPath={LOGIN_ROUTE}
      clearError={clearMessages}
    />
  );
};

export default PasswordResetEmailPage;
