import React from "react";
import { Container } from "react-bootstrap";
import CustomButton from "../CustomButton/CustomButton";
import "./Banner.css";

const Banner = ({ backgroundImage, text, buttonText, buttonLink }) => {
  return (
    <div
      className="banner"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
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
