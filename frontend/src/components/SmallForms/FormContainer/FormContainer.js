import React from "react";
import { Link } from "react-router-dom";
import "./FormContainer.css";
import CustomButton from "../../Common/CustomButton/CustomButton";

// Areusable form container component that accepts dynamic
// fields and handles form submission, error display, and links for navigation
const FormContainer = ({
  title, // Title to display at the top of the form
  fields, // Array of fields to dynamically render input elements
  error, // Error message to display (if any)
  isLoading, // Boolean indicating if the form is in a loading state
  submitText, // Text to display on the submit button
  onSubmit, // Function to handle form submission
  onInputChange, // Function to handle input changes for each field
  linkText, // Text to display for a primary link (if any)
  linkPath, // Text to display for a primary link (if any)
  extraLinkText, // Text for an additional link (if any)
  extraLinkPath, // Path for an additional link (if any)
  clearError, // Function to clear error message when user focuses on an input
}) => {
  return (
    <div className="form-container-wrapper">
      <div className="form-container-content">
        {error && (
          <p className="form-content-paragraph" style={{ color: "red" }}>
            {error}
          </p>
        )}
        <form className="form-content-form" onSubmit={onSubmit}>
          <h2 className="form-content-heading">{title}</h2>
          {/* Dynamically render input fields based on the 'fields' prop */}
          {fields.map((field) => (
            <input
              key={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={field.value}
              className="form-content-input"
              onChange={(e) => onInputChange(field.name, e.target.value)}
              onFocus={() => clearError()}
              required
            />
          ))}
          <CustomButton type="submit" size="sm" disabled={isLoading}>
            {isLoading ? "Loading..." : submitText}
          </CustomButton>
          {/* Display the first link if linkText and linkPath are provided */}
          {linkText && linkPath && (
            <p className="form-content-link-paragraph">
              <Link to={linkPath}>{linkText}</Link>
            </p>
          )}
          {/* Display an extra link if extraLinkText and extraLinkPath are provided */}
          {extraLinkText && extraLinkPath && (
            <p className="form-content-link-paragraph">
              <Link to={extraLinkPath}>{extraLinkText}</Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormContainer;
