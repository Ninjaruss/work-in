import React, { useState } from "react";
import {Container, Modal, Button} from "react-bootstrap";
import Calendar from 'react-calendar';
import './Calendar.css';

import DayViewModal from './DayViewModal';

const CalendarPage = () => {
    const [date, setDate] = useState(new Date());
    const [dayView, setShowDay] = useState(false);

    const handleCloseDay = () => setShowDay(false);
    const handleShowDay = () => setShowDay(true);

    return (
        <Container>
            <DayViewModal dayView={dayView} date={date} handleCloseDay={handleCloseDay} handleShowDay={handleShowDay}></DayViewModal>
            <Container className="col-lg-8">
                <Calendar onChange={setDate} value={date} onClickDay={handleShowDay}/>
            </Container>
        </Container>
    )
}
    
export default CalendarPage
