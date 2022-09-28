import logo from './logo.svg';
import './App.css';

import {Button, Nav, Navbar, Form, Container, Row, Col, Card} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      {/* Navbar Header*/} 
      <Navbar expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
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
            <Nav className="me-auto">
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href="/contact">Contact Us</Nav.Link>
            </Nav>
          
            <Nav>
              <Button variant="outline-info" href="/login">Login</Button>{' '}
            </Nav>
          </Navbar.Collapse>  
        </Container>
      </Navbar>

      {/* Main Content*/}
      <main>
        <Container>
          <Row className="mx-auto my-4">
            <Col>
              <h1>What is Work-in?</h1>
              <p class="text-start">
                Work-in is a user-based FREE web application that allows members in a business to create, update, and view a work schedule seamlessly.
              </p>
              <h2>Features</h2>
              <p class="text-start">– User-friendly interface to view a work schedule</p>
              <p class="text-start">- Reduce time and stress to create a weekly work schedule</p>
              <p class="text-start">- Easily update a work schedule</p>
            </Col>
            <Col>
              <Card>
                <h1>Sign Up</h1>
                <p>
                  Try out Work-in with your business today!
                </p>
                <Form className="mx-4">
                  <Form.Group className="mb-3" controlId="formFirst">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="name" placeholder="John" required/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formLast">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="name" placeholder="Doe" required/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formCompany">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control type="name" placeholder="Work-in" required/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="name@example.com" required/>
                  </Form.Group>
                  
                  <Button className="my-3" type="submit" variant="info">
                    Sign Up
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>

        <hr class="bg-danger border-2 border-top border-danger"></hr>
        
        <Container >
          <Row className="mx-auto my-4">
            <Col>
              <Card className="img-fluid" style={{ width: '35rem' }}>
                <Card.Img variant="top" src="https://i.kym-cdn.com/entries/icons/mobile/000/031/673/hank_died_walt_cries_(breaking_bad_spoilers)_1-35_screenshot.jpg" />
                {/*
                <Card.Body>
                  <Card.Title>Card Title</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                  </Card.Text>
                </Card.Body>
                */}
              </Card> 
            </Col>

            <Col lg="1"></Col>
            <Col lg="4">
              <h1>No more scheduling issues.</h1>
              <p class="text-start">
                Below is an example form built entirely with Bootstrap’s form controls. 
                Each required form group has a validation state that can be triggered by attempting to submit the form without completing it.
              </p>
            </Col>
            <Col lg="1"></Col>
          </Row>
        </Container>

        <hr class="bg-danger border-2 border-top border-danger"></hr>
        
        <Container >
          <Row className="mx-auto my-3">
          <Col lg="1"></Col>
            <Col lg="4">
              <h1>No more scheduling issues.</h1>
              <p class="text-start">
                Below is an example form built entirely with Bootstrap’s form controls. 
                Each required form group has a validation state that can be triggered by attempting to submit the form without completing it.
              </p>
            </Col>
            <Col lg="1"></Col>

            <Col>
              <Card style={{ width: '30rem'}}>
                <Card.Img variant="top" src="https://i.kym-cdn.com/photos/images/newsfeed/002/069/848/829.jpg" />
                <Card.Body>
                  <Card.Title>Card Title</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col> 
          </Row>
        </Container>
      </main>

      {/* Footer */}
      <div class="container">
      <hr class="bg-danger border-2 border-top border-danger"></hr>
        <footer class="py-3 my-4">
          <ul class="nav justify-content-center border-bottom pb-3 mb-3">
            <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">Home</a></li>
            <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">Features</a></li>
            <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">FAQs</a></li>
            <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">About</a></li>
          </ul>
          <p class="text-center text-muted">© 2022 Company, Inc</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
