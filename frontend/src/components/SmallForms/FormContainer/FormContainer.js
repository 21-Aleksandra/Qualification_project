import React from "react";
import { Link } from "react-router-dom";
import "./FormContainer.css";
import CustomButton from "../../Common/CustomButton/CustomButton";

const FormContainer = ({
  title,
  fields,
  error,
  isLoading,
  submitText,
  onSubmit,
  onInputChange,
  linkText,
  linkPath,
  extraLinkText,
  extraLinkPath,
  clearError,
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
          {linkText && linkPath && (
            <p className="form-content-link-paragraph">
              <Link to={linkPath}>{linkText}</Link>
            </p>
          )}
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
