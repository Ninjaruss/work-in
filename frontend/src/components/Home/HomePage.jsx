import React from "react";
import {Button, Form, Container, Row, Col, Card, Nav} from "react-bootstrap";

const HomePage = () => {

    return (
        <Container>
            <Nav className="justify-content-md-center">
                <Nav.Link href="/calendar">
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.ImgOverlay>
                            <Card.Title className="position-absolute bottom-0 start-50 translate-middle-x">Calendar</Card.Title>
                        </Card.ImgOverlay>
                    </Card>
                </Nav.Link>
                <Nav.Link href="/profile">
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.ImgOverlay>
                            <Card.Title className="position-absolute bottom-0 start-50 translate-middle-x">Profile</Card.Title>
                        </Card.ImgOverlay>
                    </Card>
                </Nav.Link>
                <Nav.Link href="/timecard">
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src="holder.js/100px180" />
                        <Card.ImgOverlay>
                            <Card.Title className="position-absolute bottom-0 start-50 translate-middle-x">Timecard</Card.Title>
                        </Card.ImgOverlay>
                    </Card>
                </Nav.Link>
            </Nav>
        </Container>
    )
}

export default HomePage