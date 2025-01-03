import React, { useContext, useState } from "react";
import {
  Navbar,
  Nav,
  Button,
  Container,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Context } from "../../../index";
import { useNavigate } from "react-router-dom";
import navigationLinks from "../../../utils/navigationLinks";
import profileLinks from "../../../utils/profileLinks";
import { logoutUser } from "../../../api/AuthAPI";
import logoImage from "../../../assets/logo.png";
import CustomButton from "../../Common/CustomButton/CustomButton";

import "./Navbar.css";
import {
  DASHBOARD_ROUTE,
  REGISTER_ROUTE,
  LOGIN_ROUTE,
  LANDING_ROUTE,
} from "../../../utils/routerConsts";

// Navbar component that contains no links for unreqistered users and specific links for authorized users
// Those links are stored in /utils/profileLinks and utils/navigationLinks
// Is observable for dynamic user info changes
const NavigationBar = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const profilePicUrl = user?.url
    ? `${process.env.REACT_APP_SERVER_URL}${user.url}`
    : require("../../../assets/default_user_small.png");

  const handleLogout = async () => {
    try {
      await logoutUser();
      user.logout();
      navigate(LANDING_ROUTE);
    } catch (error) {
      console.error("Logout failed:", error?.message);
      alert(`Logout failed`);
    }
  };

  const toggleOffcanvas = () => setShowOffcanvas(!showOffcanvas);

  // Checking if the user has permission to access certain links based on their roles
  const hasPermission = (allowedRoles) => {
    return allowedRoles.some((role) => user.roles.includes(role));
  };

  return (
    <Navbar expand="lg" className="navbar-custom shadow-sm">
      <Container fluid>
        <Navbar.Brand
          href={user.isAuth ? DASHBOARD_ROUTE : LANDING_ROUTE} // Redirect to Dashboard if authenticated, otherwise Landing page
          className="navbar-brand-custom"
        >
          <img src={logoImage} alt="Goodspire Logo" className="navbar-logo" />
          <span className="navbar-brand-name">Goodspire</span>
        </Navbar.Brand>
        {/* Toggle button for collapsing the navbar (hidden on large screens) */}
        <Navbar.Toggle className="d-none" aria-controls="basic-navbar-nav" />

        {/* Navbar Links for Authenticated Users */}
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-center"
        >
          {user.isAuth && (
            <Nav className="mx-auto">
              {navigationLinks
                .filter((link) => hasPermission(link.allowedRoles))
                .map((link, index) => (
                  <Nav.Link
                    key={index}
                    href={link.link}
                    className="nav-link-custom"
                  >
                    {link.name}
                  </Nav.Link>
                ))}
            </Nav>
          )}
        </Navbar.Collapse>

        {/* Navbar Actions for Authenticated Users (Profile and Logout) */}
        {user.isAuth ? (
          <div className="d-none d-lg-block">
            <NavDropdown
              title={
                <div className="d-flex align-items-center">
                  <img
                    src={profilePicUrl}
                    alt="Profile"
                    className="navbar-profile-pic"
                  />
                  <span className="ms-2">{user.user}</span>
                </div>
              }
              id="user-dropdown"
              align="end"
              className="user-dropdown-custom"
            >
              {profileLinks
                .filter((link) => hasPermission(link.allowedRoles))
                .map((link, index) => (
                  <NavDropdown.Item
                    key={index}
                    href={link.link}
                    onClick={link.onClick ? link.onClick : undefined}
                  >
                    {link.name}
                  </NavDropdown.Item>
                ))}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </div>
        ) : (
          <div className="d-none d-lg-flex align-items-center me-3">
            <CustomButton
              onClick={() => navigate(LOGIN_ROUTE)}
              size="sm"
              className="me-2"
            >
              Login
            </CustomButton>
            <CustomButton
              onClick={() => navigate(REGISTER_ROUTE)}
              size="sm"
              className="me-2"
            >
              Sign Up
            </CustomButton>
          </div>
        )}

        <Button
          variant="secondary"
          className="d-lg-none offcanvas-toggle-custom"
          onClick={toggleOffcanvas}
        >
          ☰
        </Button>

        <Offcanvas
          show={showOffcanvas}
          onHide={toggleOffcanvas}
          placement="end"
        >
          {/* Offcanvas Menu (Mobile View) */}
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              {user.isAuth && (
                <div className="mb-3">
                  <div className="d-flex align-items-center offcanvas-user-info">
                    <img
                      src={profilePicUrl}
                      alt="Profile"
                      className="navbar-profile-pic"
                    />
                    <div className="offcanvas-username ms-2">{user.user}</div>
                  </div>
                  {profileLinks
                    .filter((link) => hasPermission(link.allowedRoles))
                    .map((link, index) => (
                      <Nav.Link
                        key={index}
                        href={link.link}
                        onClick={toggleOffcanvas}
                      >
                        {link.name}
                      </Nav.Link>
                    ))}
                  <hr />
                </div>
              )}
              {user.isAuth &&
                navigationLinks
                  .filter((link) => hasPermission(link.allowedRoles))
                  .map((link, index) => (
                    <Nav.Link
                      key={index}
                      href={link.link}
                      onClick={toggleOffcanvas}
                    >
                      {link.name}
                    </Nav.Link>
                  ))}
              {!user.isAuth && (
                <>
                  <Nav.Link
                    onClick={() => {
                      navigate(LOGIN_ROUTE);
                      toggleOffcanvas();
                    }}
                  >
                    Login
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => {
                      navigate(REGISTER_ROUTE);
                      toggleOffcanvas();
                    }}
                  >
                    Sign Up
                  </Nav.Link>
                </>
              )}
              {user.isAuth && (
                <>
                  <hr />
                  <Nav.Link
                    onClick={() => {
                      handleLogout();
                      toggleOffcanvas();
                    }}
                    className="mt-3"
                  >
                    Logout
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </Navbar>
  );
});

export default NavigationBar;
