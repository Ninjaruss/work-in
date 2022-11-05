import React from "react";
import {Nav, Navbar, Button} from "react-bootstrap";
import { Link } from 'react-router-dom';

const NavbarHeader = () => {
  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="/" className="ps-5">
        <img
            alt=""
            src="/logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          Work-in
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav.Item className="ml-auto pe-4">
          <Nav.Link>
            <Link to="/login">
              <Button variant="primary">
                Sign In
              </Button>
            </Link>
          </Nav.Link>
        </Nav.Item>
    </Navbar.Collapse>  
    </Navbar>
  )
}

export default NavbarHeader