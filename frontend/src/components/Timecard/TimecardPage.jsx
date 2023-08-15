import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import {Button, Container, ListGroup} from "react-bootstrap";

import {
    createCalendar,
    getCalendarById,
    updateCalendar,
    deleteCalendar,
    getCalendarByUserId,
    updateCalendarByUserId,
    updateCalendarByOrganizationId,
    deleteCalendarByUserId,
  } from '../../features/calendarService';

const hours = 37.5
const wage = 17.50

const start = new Date();
const end = new Date(new Date().setMinutes(start.getMinutes() + 30));
const initEvents = [
    {
        calendarId: "personal",
        category: "time",
        isVisible: true,
        title: "Study",
        id: "1",
        body: "Test",
        start,
        end
    },
    {
        calendarId: "organization",
        category: "time",
        isVisible: true,
        title: "Meeting",
        id: "2",
        body: "Description",
        start: new Date(new Date().setHours(start.getHours() + 1)),
        end: new Date(new Date().setHours(start.getHours() + 2))
    }
]

const calendarData = {
    userId: '6438f8eea5398febfc3e8abd',
    events: initEvents
  };

const TimecardPage = () => {
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        if (user) {
          createCalendar(calendarData)
            .then(calendar => {
              console.log('Calendar created:', calendar);
            })
            .catch(error => {
              console.error(error);
            });
    
          getCalendarByUserId(user._id)
            .then(calendar => {
              console.log('Calendar received:', calendar);
            })
            .catch(error => {
              console.error(error);
            });
        }
    }, []); // Empty dependency array to run effect only once on mount    
    
    return (
        <Container className="my-5">
            <h1>Week Payout Estimate</h1>
            <p>*all estimates are based off of wage rate and hours worked this week</p>
            <ListGroup className="mx-auto w-50">
                <ListGroup.Item> <b>Hours worked: </b>{hours}</ListGroup.Item>
                <ListGroup.Item><b>Base wage: </b>{wage}</ListGroup.Item>
                <ListGroup.Item><b>Total Estimate: </b>{hours*wage}</ListGroup.Item>
            </ListGroup>
            {user ? ( // Conditional rendering to handle cases where user is null or not yet fetched
                <ul>
                    {user._id}
                </ul>
                ) : (
                <p>Loading user data...</p>
                
            )}   
                        
        </Container>
    )
}

export default TimecardPage