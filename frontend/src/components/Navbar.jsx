import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar as BSNavbar,
  Nav,
  Container,
  Button,
} from "react-bootstrap";
import PropTypes from "prop-types";
import { UserContext } from "../context/UserContext";
import "./Navbar.css";

function Navbar({ transparent = false }) {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <BSNavbar
      className={`ic-navbar${transparent ? " ic-navbar-transparent" : ""}`}
      expand="md"
      data-bs-theme={transparent ? "light" : "dark"}
    >
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="ic-navbar-brand">
          InterviewCircle
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="main-nav" />
        <BSNavbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/browse">
              Browse
            </Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/submit">
                Submit
              </Nav.Link>
            )}
            {user && (
              <Nav.Link as={Link} to="/my-submissions">
                My Submissions
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Item className="d-flex align-items-center me-3 ic-navbar-username">
                  {user.username}
                </Nav.Item>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Log In
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

Navbar.propTypes = {
  transparent: PropTypes.bool,
};

export default Navbar;
