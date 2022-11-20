import React from 'react';
import {Form, Container, Button, Row, Navbar, Nav} from "react-bootstrap";

const NavbarFooter = () => {
  return (
    <Container>
      <hr class="border-2 border-top border-dark"></hr>
    
        <Container>
          <Row className="w-50 mx-auto">
            <p class="text-center text-muted">© 2022 Work-in, Inc</p>
          </Row>
        </Container>
    </Container>
  )
}

export default NavbarFooter