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

const NavigationBar = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

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

  const hasPermission = (allowedRoles) => {
    return allowedRoles.some((role) => user.roles.includes(role));
  };

  return (
    <Navbar expand="lg" className="navbar-custom shadow-sm">
      <Container fluid>
        <Navbar.Brand
          href={user.isAuth ? DASHBOARD_ROUTE : LANDING_ROUTE}
          className="navbar-brand-custom"
        >
          <img src={logoImage} alt="Goodspire Logo" className="navbar-logo" />
          <span className="navbar-brand-name">Goodspire</span>
        </Navbar.Brand>

        <Navbar.Toggle className="d-none" aria-controls="basic-navbar-nav" />

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

        {user.isAuth ? (
          <div className="d-none d-lg-block">
            <NavDropdown
              title={user.user}
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
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              {user.isAuth && (
                <div className="mb-3">
                  <div className="offcanvas-username">{user.user}</div>
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
