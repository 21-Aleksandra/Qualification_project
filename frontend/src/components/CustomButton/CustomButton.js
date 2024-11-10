import React from "react";
import PropTypes from "prop-types";
import "./CustomButton.css";

const CustomButton = ({
  children,
  onClick,
  size = "md",
  className = "",
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`custom-button custom-button-${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

CustomButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
};

export default CustomButton;
