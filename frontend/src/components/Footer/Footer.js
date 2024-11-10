import React from "react";
import { Container } from "react-bootstrap";
import instagramIcon from "../../assets/instagram.png";
import twitterIcon from "../../assets/twitter.png";
import facebookIcon from "../../assets/facebook.png";
import tiktokIcon from "../../assets/tiktok.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className=" py-3 mt-4">
      <Container className="text-center">
        <p>Follow us on:</p>
        <div className="social-links">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="me-3"
          >
            <img src={instagramIcon} alt="Instagram" className="social-icon" />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="me-3"
          >
            <img src={twitterIcon} alt="Twitter" className="social-icon" />
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="me-3"
          >
            <img src={facebookIcon} alt="Facebook" className="social-icon" />
          </a>
          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={tiktokIcon} alt="TikTok" className="social-icon" />
          </a>
        </div>
        <p>
          &copy; {new Date().getFullYear()}, Goodspire. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
