import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import { Container, Card, Nav} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import {
    getCalendarByUserId,
  } from '../../features/calendarService';

function HomePage() {
    const user = useSelector(state => state.auth.user);
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {    
            // Fetch calendars from calendarService
            getCalendarByUserId(user._id)
                .then(calendar => {
                    console.log("Calendar found!");
                })
                .catch(error => {
                    console.error('Error fetching calendars:', error)
                    navigate('/onboarding') // Update to the verification page route
                });
        }
    }, [navigate, user, user.id]);

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