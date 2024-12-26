import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { loginUser, registerUser } from "../../api/AuthAPI";
import FormContainer from "../../components/SmallForms/FormContainer/FormContainer";
import {
  DASHBOARD_ROUTE,
  REGISTER_ROUTE,
  LOGIN_ROUTE,
  RESET_PASSWORD_MAIL_ROUTE,
  LANDING_ROUTE,
} from "../../utils/routerConsts";
import { Spinner } from "react-bootstrap";

// A form that serves both the login and register form roles based on link provided
const LoginRegisterPage = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const clearMessages = () => setError("");
  const isRegisterPage = location.pathname === REGISTER_ROUTE;

  const handleInputChange = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
    clearMessages();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setIsLoading(true);

    if (isRegisterPage) {
      // Registration logic: Check if passwords match before proceeding to be sure about users input
      if (formState.password !== formState.confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
      }
      try {
        await registerUser(
          formState.username,
          formState.email,
          formState.password
        );
        window.alert(
          "Registration successful! Please check your email for an activation link."
        );
        navigate(LANDING_ROUTE);
      } catch (err) {
        setError(err?.message || "Registration failed.");
      }
    } else {
      // Login logic: Attempt to log the user in
      try {
        const response = await loginUser(formState.email, formState.password);
        if (response.roles.length > 0) {
          // If user has roles, they are authenticated and logged in
          user.setAuth(true);
          user.setUser(response.username);
          user.setRoles(response.roles);
          user.setId(response.id);
          user.setUrl(response.url);
          navigate(DASHBOARD_ROUTE);
        } else {
          window.alert(
            "There is a problem with your account, contact the administrator!"
          );
          user.logout();
          navigate(LANDING_ROUTE);
        }
      } catch (err) {
        setError(err?.message || "Login failed.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Clear any error messages when the page (login or register) changes
  useEffect(() => {
    clearMessages();
  }, [isRegisterPage]);

  // Set up fields for the form based on whether it's for login or registration
  const fields = isRegisterPage
    ? [
        {
          name: "username",
          type: "text",
          placeholder: "Username",
          value: formState.username,
        },
        {
          name: "email",
          type: "email",
          placeholder: "Email",
          value: formState.email,
        },
        {
          name: "password",
          type: "password",
          placeholder: "Password",
          value: formState.password,
        },
        {
          name: "confirmPassword",
          type: "password",
          placeholder: "Confirm Password",
          value: formState.confirmPassword,
        },
      ]
    : [
        {
          name: "email",
          type: "email",
          placeholder: "Email",
          value: formState.email,
        },
        {
          name: "password",
          type: "password",
          placeholder: "Password",
          value: formState.password,
        },
      ];
  if (isLoading) {
    return (
      <div id="subsidiary-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <FormContainer
      title={isRegisterPage ? "Register" : "Login"}
      fields={fields}
      error={error}
      isLoading={isLoading}
      submitText={isRegisterPage ? "Register Me" : "Login Me"}
      onSubmit={handleSubmit}
      onInputChange={handleInputChange}
      linkText={
        isRegisterPage
          ? "Already a member? Login here"
          : "Not a member? Register here"
      }
      linkPath={isRegisterPage ? LOGIN_ROUTE : REGISTER_ROUTE}
      extraLinkText={!isRegisterPage ? "Forgot Password?" : null}
      extraLinkPath={!isRegisterPage ? RESET_PASSWORD_MAIL_ROUTE : null}
      clearError={clearMessages}
    />
  );
});

export default LoginRegisterPage;
