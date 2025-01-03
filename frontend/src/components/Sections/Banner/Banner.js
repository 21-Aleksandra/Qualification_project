import React from "react";
import { Container } from "react-bootstrap";
import CustomButton from "../../Common/CustomButton/CustomButton";
import "./Banner.css";

// Banner component that displays a background image, a text, and a button with a link.
const Banner = ({ backgroundImage, text, buttonText, buttonLink }) => {
  return (
    <div
      className="banner"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Banner overlay to darken the background image */}
      <div className="banner-overlay" />
      <Container className="banner-content">
        <h1 className="banner-text">{text}</h1>
        <CustomButton
          size="lg"
          className="banner-button"
          onClick={() => (window.location.href = buttonLink)}
        >
          {buttonText}
        </CustomButton>
      </Container>
    </div>
  );
};

export default Banner;
