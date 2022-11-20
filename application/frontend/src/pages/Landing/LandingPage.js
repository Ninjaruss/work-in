import React from "react";
import {Button, Form, Container, Row, Col, Card, ListGroup} from "react-bootstrap";

import NavbarHeader from '../../components/NavbarHeader';

const LandingPage = () => {
  return (
    <Container>
      <NavbarHeader />

      <Container className="mx-auto my-2 px-4 py-2 shadow-lg">
        <Row className="mx-auto justify-content-md-center">
          <Col className="my-auto">
            <Card border="light">
              <Card.Img className="" height="300" src="https://media.istockphoto.com/id/1134102363/vector/business-people-working-together-in-a-coworking-space.jpg?s=612x612&w=0&k=20&c=dF_cdzMmUZ5gYjBIEtu47qrmnCf0MfBlg38QTJf4CO4=" alt="Card image" />
              <Card.Body>
                <h1 class="display-5 fw-bold text-start">Scheduling made easy.</h1>
                <h1 class="display-5 fw-bold my-4 text-start">Set up a work schedule for your company seamlessly.</h1>
              </Card.Body>
            </Card>
          </Col>
          <Col className="my-4" sm={5}>
            <Card bg="info" className="my-2 shadow-lg">
              <h1 class="fw-bold">Sign Up</h1>
              <p>
                Try out Work-in with your business today!
              </p>
              <Form className="mx-4 fw-bold mt-4">
                <Form.Group className="mb-3" controlId="formFirst">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="name" placeholder="John"/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formLast">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="name" placeholder="Doe"/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formCompany">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control type="name" placeholder="Work-in"/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="name@example.com"/>
                </Form.Group>
                
                <Button className="my-3" type="submit" variant="light">
                  Sign Up
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>

      <hr class="border-2 border-top border-dark"></hr>

      <Container className="mx-auto shadow-lg px-4 py-5" id="point1">
        <h2 class="fw-bold display-6 mt-5">Features</h2>
        <div class="row g-4 py-5 row-cols-1 row-cols-lg-3">
          <div class="col d-flex align-items-start">
            <img
              alt=""
              src="https://cdn-icons-png.flaticon.com/512/5024/5024467.png"
              width="32.5"
              height="32.5"
              className="d-inline-block align-top"
            />
            <div>
              <h3 class="fs-2 fw-bold">Simple interface</h3>
              <p>User-friendly interface to view a work schedule for those who want simplicity. Work-in is designed to be as accessible as possible to everyone!</p>
            </div>
          </div>
          <div class="col d-flex align-items-start">
            <img
              alt=""
              src="https://cdn-icons-png.flaticon.com/512/66/66163.png"
              width="32.5"
              height="32.5"
              className="d-inline-block align-top"
            />
            <div>
              <h3 class="fs-2 fw-bold">Quick scheduling</h3>
              <p>Reduce time and stress to create a weekly work schedule by letting Work-in cut out the middle man.</p>
            </div>
          </div>
          <div class="col d-flex align-items-start">
            <img
              alt=""
              src="https://cdn-icons-png.flaticon.com/512/565/565422.png"
              width="32.5"
              height="32.5"
              className="d-inline-block align-top"
            />
            <div>
              <h3 class="fs-2 fw-bold">Never miss updates</h3>
              <p>Easily become updated with your schedule with real-time notifications! </p>
            </div>
          </div>
        </div>
      </Container>

      <hr class="border-2 border-top border-dark"></hr>
      
      <Container className="mx-auto shadow-lg px-4 py-5" id="point2">
        <Row>
          <Col>
            <Card className="img-fluid my-4" style={{ width: '35rem' }}>
              <Card.Img variant="top" src="https://media.tenor.com/dO6V4YzO2GAAAAAd/breaking-bad-walter-white.gif" />
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

          <Col className="my-auto">
            <h1 class="display-5 fw-bold text-start">No more scheduling issues</h1>
            <p class="text-start">
              Below is an example form built entirely with Bootstrap’s form controls. 
              Each required form group has a validation state that can be triggered by attempting to submit the form without completing it.
            </p>
          </Col>
        </Row>
      </Container>

      <hr class="border-2 border-top border-dark" id="point3"></hr>
      
      <Container className="mx-auto my-4 shadow-lg px-4 py-4">
        <Row>
          <Col className="my-auto">
            <h1 class="display-5 fw-bold">No more scheduling issues.</h1>
            <p class="text-start">
              Below is an example form built entirely with Bootstrap’s form controls. 
              Each required form group has a validation state that can be triggered by attempting to submit the form without completing it.
            </p>
          </Col>

          <Col>
            <Card style={{ width: '30rem'}} className="my-4">
              <Card.Img variant="top" src="https://media.tenor.com/LskIhmPr6NcAAAAM/hank.gif" />
            </Card>
          </Col> 
        </Row>
      </Container>

      <hr class="border-2 border-top border-dark" id="point3"></hr>

      <Container>
        <Card bg="info">
          <Form id="subscriber-sign-up" className="d-md-flex justify-content-between align-items-center my-1 mx-auto">
              <h4 class="mx-5">Subscribe for email updates!</h4>

              <Form.Group controlId="sign-up-email-address" className="mx-2">
                  <Form.Control type="email" size="lg" placeholder="Email address" autoComplete="username" className="position-relative text-center" />
              </Form.Group>
              <Button type="submit" variant="light"> Submit </Button>
          </Form>
        </Card>
      </Container>
    </Container>
  )
}

export default LandingPage