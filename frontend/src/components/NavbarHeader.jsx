import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Button, Nav, Navbar } from 'react-bootstrap';

const NavbarHeader = () => {
  const user = useSelector(state => state.auth.user);
  const isLoading = useSelector(state => state.auth.isLoading); // Added: Get isLoading state
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
  };

  if (isLoading) {
    // You can return a loading spinner or null, or any other default behavior here
    return null;
  }

  return (
    <Navbar expand="lg" bg="light" variant="light" sticky="top" className="shadow-sm">
      <Navbar.Brand as={Link} to="/" className="navbar-brand ps-5">
        <img
          alt=""
          src="https://w7.pngwing.com/pngs/652/289/png-transparent-red-and-white-document-bag-art-computer-icons-hamburger-button-experience-organization-icon-design-work-miscellaneous-service-logo.png"
          width="32.5"
          height="32.5"
          className="d-inline-block align-top"
        />{' '}
        Work-in
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarNav" />
      <Navbar.Collapse id="navbarNav">
        {(!user && location.pathname === '/') && (
          <Nav className="mr-auto">
            <Nav.Item>
              <Nav.Link href="#about">
                <Button variant="light">About</Button>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#features">
                <Button variant="light">Features</Button>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#updates">
                <Button variant="light">Updates</Button>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        )}
        <Nav className="ml-auto align-items-center">
          {user !== null ? (
            <>
              <Nav.Item>
                <Nav.Link
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                  className="nav-link"
                >
                  <div className="d-flex align-items-center">
                    <span className="me-2">{`${user.first_name} ${user.last_name}`}</span>
                    <Button variant="outline-dark">Logout</Button>
                  </div>
                </Nav.Link>
              </Nav.Item>
            </>
          ) : (
            <Nav.Item>
              <Nav.Link as={Link} to="/login" className="nav-link">
                <Button variant="outline-dark">Login</Button>
              </Nav.Link>
            </Nav.Item>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarHeader;