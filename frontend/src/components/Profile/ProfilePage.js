import React from "react";
import {Button, Form, Container, Row, Col, Card, Nav, ListGroup} from "react-bootstrap";

/* ES6 module in Node.js environment */
import TuiCalendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css'; // Stylesheet for calendar


const ProfilePage = () => {

    const calendars = [{ id: 'cal1', name: 'Personal' }];
    const initialEvents = [
        {
        id: '1',
        calendarId: 'cal1',
        title: 'Lunch',
        category: 'time',
        start: '2022-10-28T12:00:00',
        end: '2022-10-28T13:30:00',
        },
        {
        id: '2',
        calendarId: 'cal1',
        title: 'Coffee Break',
        category: 'time',
        start: '2022-10-29T15:00:00',
        end: '2022-10-29T15:30:00',
        },
    ];

    const requestDayOff = () => {

    }

    const changeAvailability = () => {

    }
    
    return (
        
        <Container className="mx-auto my-4 justify-content-md-center">
            <Row className="mx-auto my-4 justify-content-md-center">
                <Col>
                <Card style={{ width: '15rem' }}>
                    <Card.Img variant="top" src="holder.js/100px180" />
                </Card>
                </Col>
                <Col>
                    <ListGroup className="w-50 mx-auto m-5">
                        <ListGroup.Item action onClick={requestDayOff}><b>Request day off</b></ListGroup.Item>
                        <ListGroup.Item action onClick={changeAvailability}><b>Change availability</b></ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            <Row className="mx-auto my-4 justify-content-md-center">
                <TuiCalendar
                  view="week"
                  week={{
                    eventView: ['time'],
                    taskView: false,
                    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                  }}
                  calendars={calendars}
                  events={initialEvents}
                />
            </Row>
            

        </Container>
    )
}

export default ProfilePage