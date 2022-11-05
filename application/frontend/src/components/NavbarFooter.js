import React from 'react';
import {Form, Container, Button, Row, Navbar, Nav} from "react-bootstrap";

const NavbarFooter = () => {
  return (
    <Container>
      <hr class="bg-danger border-2 border-top border-danger"></hr>
    
        <Container>
          <Row className="w-50 mx-auto">
            <h1>Coming 2023</h1>
            <Form id="subscriber-sign-up" className="text-center p-3">
              <h1 className="mb-3 fs-3 fw-normal">Subscribe for email updates</h1>
              <Form.Group controlId="sign-up-email-address">
                  <Form.Control type="email" size="lg" placeholder="Email address" autoComplete="username" className="position-relative text-center" />
              </Form.Group>
              <Button className="my-3" type="submit" variant="info"> Submit </Button>
            </Form>
            <p class="text-center text-muted">© 2022 Work-in, Inc</p>
          </Row>
        </Container>
    </Container>
  )
}

export default NavbarFooter