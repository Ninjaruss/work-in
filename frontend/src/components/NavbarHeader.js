import React from "react";
import {Nav, Navbar, Button, Container, NavDropdown, Col} from "react-bootstrap";
import { Link } from 'react-router-dom';

const NavbarHeader = () => {
  return (
    <Navbar expand="lg" bg="light" variant="light" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/" className="ps-5">
          <h3>
          <img
              alt=""
              src="https://w7.pngwing.com/pngs/652/289/png-transparent-red-and-white-document-bag-art-computer-icons-hamburger-button-experience-organization-icon-design-work-miscellaneous-service-logo.png"
              width="32.5"
              height="32.5"
              className="d-inline-block align-top"
            />{' '}
            Work-in</h3>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Col>
            <Nav className="d-flex">
              <Nav.Item>
                <Nav.Link href="#about"><Button variant="light">About</Button></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#features"><Button variant="light">Features</Button></Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#updates"><Button variant="light">Updates</Button></Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          {/*
          <Nav.Item className="ml-auto pe-4">
            <Nav.Link>
              <Link to="/login">
                <Button variant="info" size="lg">
                  Sign In
                </Button>
              </Link>
            </Nav.Link>
          </Nav.Item>
          */}
        </Navbar.Collapse> 
      </Container> 
    </Navbar>
  )
}

export default NavbarHeader