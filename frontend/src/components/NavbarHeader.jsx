import React from "react";
import {Nav, Navbar, Button, Container, NavDropdown, Col} from "react-bootstrap";

import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

function NavbarHeader() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

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
          
          <ul>
            {user ? (
              <li>
                <button className='btn' onClick={onLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link to='/login'>
                    <FaSignInAlt /> Login
                  </Link>
                </li>
                <li>
                  <Link to='/register'>
                    <FaUser /> Register
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          
        </Navbar.Collapse> 
      </Container> 
    </Navbar>
  )
}

export default NavbarHeader