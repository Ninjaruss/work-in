import React from "react";
import {Button, Form, Container, Row, Col, Card, ListGroup, Image, Ratio} from "react-bootstrap";

import NavbarHeader from '../../components/NavbarHeader';

const LandingPage = () => {
  return (
    <Container>
      <NavbarHeader />

      <Container className="mx-auto my-2 px-4 py-2 shadow-lg">
        <Row className="mx-auto justify-content-md-center">
          <Col className="my-auto">
            <Card border="light">
              <Card.Text>
                <h1 class="display-4 fw-normal">Work-in</h1>
                <p class="lead fw-normal">Create, Update, and View your work schedule</p>
              </Card.Text>
              <Card.Img class="mx-auto" width="50%" src="https://media.istockphoto.com/id/1191395009/vector/group-of-people-stand-near-big-calendar-watches-document-time-management-work-schedule.jpg?s=612x612&w=0&k=20&c=v1YF-esfPoKrCsXS3P3xvPyAZvxe6Tw8flwM3Rl5Wiw=" alt="Card image" />
            </Card>
          </Col>
        </Row>
      </Container>

      {/*
      <Container className="mx-auto my-2 px-4 py-2 shadow-lg">
        <Row className="mx-auto justify-content-md-center">
          <Col className="my-auto">
            <Card border="light">
              <Card.Img className="" height="300" src="https://media.istockphoto.com/id/1134102363/vector/business-people-working-together-in-a-coworking-space.jpg?s=612x612&w=0&k=20&c=dF_cdzMmUZ5gYjBIEtu47qrmnCf0MfBlg38QTJf4CO4=" alt="Card image" />
              <Card.Body>
                <h1 class="display-5 fw-bold text-start">Scheduling made easy.</h1>
                <h1 class="display-5 fw-bold my-4 text-start">Set up a work schedule for your business seamlessly.</h1>
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
                  <Form.Control type="name" placeholder="Walter"/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formLast">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="name" placeholder="White"/>
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
      */}

    <hr class="border-2 border-top border-dark"></hr>

      <Container className="mx-auto shadow-lg px-4 py-5" id="about">
        <Row>
          <Col>
            <Card className="img-fluid my-4" border="light" style={{ width: '35rem' }}>
              <Card.Img variant="top" src="https://cdn.dribbble.com/users/3182781/screenshots/6974992/wykres-800x600.gif" />
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
            <h1 class="display-4 fw-normal text-start">What is Work-in?</h1>
            <p class="text-start lead fw-normal">
            Work-in is a user-based <b>FREE</b> application that allows members in a business to create, update, and view a work schedule seamlessly
            </p>
          </Col>
        </Row>
      </Container>

      <hr class="border-2 border-top border-dark"></hr>

      <Container className="mx-auto shadow-lg px-4 py-5" id="features">
        <h2 class="fw-normal display-4 mt-5">Why use Work-in?</h2>
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
              <h3 class="fs-2 fw-normal lead">User-friendly interface</h3>
              <p>Designed to be accessible to all businesses: especially for small businesses.</p>
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
              <h3 class="fs-2 fw-normal lead">Quick scheduling</h3>
              <p>Reduce time and stress when creating weekly schedules.</p>
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
              <h3 class="fs-2 fw-normal lead">Accessiblity</h3>
              <p>Easily view your schedule no matter where you are.</p>
            </div>
          </div>
        </div>
      </Container>

      <hr class="border-2 border-top border-dark"></hr>
      
      <div class="embed-responsive embed-responsive-21by9" width="100%" height="100%" id="updates">
        <iframe class="embed-responsive-item" scrolling="auto" src="https://de2f03e2.sibforms.com/serve/MUIEAOjUa-kO4zrPZEy2_fWxI73k7im5FKaXkK2VGxT46Rs9lkZFLUiLyMLZUR0GOIYUqjRuoTIYvga1gPOyPixE5gORhZLhIEvNL8kctcUwIpc5k7P6NpL8o_JjsT6PbJOYE72KvoVeFoEg9DmHhJB1DrhnGxX2qTexMzE_vS58PaN_gqWqhebHVl-6SpLfKL_o104J_NDy3zY7" allowfullscreen></iframe>
      </div>  
    </Container>
  )
}

export default LandingPage