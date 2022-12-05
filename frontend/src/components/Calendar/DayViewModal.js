import React from "react";
import {Button, Form, Container, Row, Col, Card, Modal} from "react-bootstrap";
import './CalendarModals.css';

/* ES6 module in Node.js environment */
import TuiCalendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css'; // Stylesheet for calendar
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

const DayViewModal = (props) => {

    const calendars = [{ id: 'cal1', name: 'Personal' }];
    const initialEvents = [
        {
        id: '1',
        calendarId: 'cal1',
        title: 'Lunch',
        category: 'time',
        start: '2022-10-30T12:00:00',
        end: '2022-10-30T13:30:00',
        },
        {
        id: '2',
        calendarId: 'cal1',
        title: 'Coffee Break',
        category: 'time',
        start: '2022-10-29T15:00:00',
        end: '2022-10-29T15:30:00',
        },
        {
            id: '3',
            calendarId: 'cal1',
            title: 'Gaming',
            category: 'time',
            start: '2022-10-30T01:00:00',
            end: '2022-10-30T02:30:00',
            },
    ];

    /*
    React Variables exported to Calendar
    const [dayView, setShowDay] = useState(false);
    const handleCloseDay = () => setShowDay(false);
    const handleShowDay = () => setShowDay(true); 
    */
    return (
        <Modal show={props.dayView} onHide={props.handleCloseDay} dialogClassName="dayview-modal">
            <Modal.Header closeButton>
                <Modal.Title>Day View</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                Selected date: {props.date.toLocaleDateString()}
                <Container>
                    <Row>
                        <Col sm={2}>Filters</Col>
                        <Col sm={8}>
                        <TuiCalendar
                            view="day"
                            week={
                                {
                                eventView: ['time'],
                                taskView: false,
                                useDetailPopup: true,
                                dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                                }
                            }
                            calendars={calendars}
                            events={initialEvents}
                        />
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleCloseDay}>
                    Close
                </Button>
                <Button variant="primary" onClick={props.handleCloseDay}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    ); 
};

export default DayViewModal