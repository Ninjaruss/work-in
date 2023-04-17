import React, { useRef, useState, useEffect, useCallback } from "react";
import { useSelector } from 'react-redux';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';

import { v4 as uuidv4 } from 'uuid';

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

const start = new Date();
const end = new Date(new Date().setMinutes(start.getMinutes() + 30));
const initCalendars = [{ id: '1', name: 'Personal'},{ id: '2', name: 'Company' }, { id: '3', name: 'Available' }];
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
        calendarId: "company",
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

const OnboardingPage = () => {
  const user = useSelector(state => state.auth.user);

  const [isOwner, setIsOwner] = useState(false);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleOwnerChange = (e) => {
    setIsOwner(e.target.checked);
  };

  const handleMemberChange = (e, index) => {
    const { name, value } = e.target;
    const updatedMembers = [...members];
    updatedMembers[index][name] = value;
    setMembers(updatedMembers);
  };

  const handleAddMember = () => {
    setMembers([...members, { fullName: '', email: '', phone: '', position: '' }]);
  };

  const handleEventChange = (e, index) => {
    const { name, value } = e.target;
    const updatedEvents = [...events];
    updatedEvents[index][name] = value;
    setEvents(updatedEvents);
  };

  const handleAddEvent = () => {
    setEvents([...events, { date: '', time: '', duration: '', location: '' }]);
  };

  const handleSubmit = () => {
    // Perform submission logic here
    setSuccess(true);
    // Reset form fields
    setIsOwner(false);
    setMembers([]);
    setEvents([]);
  };

  return (
    <Container className="mt-5">
      <h1>Welcome to the Onboarding Tutorial</h1>
      {success && (
        <Alert variant="success">
          Your information has been submitted successfully! You can now proceed to other parts of the website.
        </Alert>
      )}
      <Form>
        <Form.Group>
          <Form.Label>Are you the owner or the person authorized to set up this account for this business/organization?</Form.Label>
          <Form.Check
            type="checkbox"
            id="isOwnerCheckbox"
            label="Yes"
            checked={isOwner}
            onChange={handleOwnerChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Members</Form.Label>
          {members.map((member, index) => (
            <Row key={index}>
              <Col md={3}>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={member.fullName}
                  onChange={(e) => handleMemberChange(e, index)}
                  placeholder="Full Name"
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="email"
                  name="email"
                  value={member.email}
                  onChange={(e) => handleMemberChange(e, index)}
                  placeholder="Email"
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="text"
                  name="phone"
                  value={member.phone}
                  onChange={(e) => handleMemberChange(e, index)}
                  placeholder="Phone Number"
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="text"
                  name="position"
                  value={member.position}
                  onChange={(e) => handleMemberChange(e, index)}
                  placeholder="Position"
                />
              </Col>
            </Row>
          ))}
          <Button variant="secondary" onClick={handleAddMember}>
            Add Member
          </Button>
        </Form.Group>

        <Form.Group>
          <Form.Label>Events</Form.Label>
          {events.map((event, index) => (
            <Row key={index}>
              <Col md={3}>
                <Form.Control
                  type="date"
                  name="date"
                  value={event.date}
                  onChange={(e) => handleEventChange(e, index)}
                  placeholder="Date"
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="time"
                  name="time"
                  value={event.time}
                  onChange={(e) => handleEventChange(e, index)}
                  placeholder="Time"
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="text"
                  name="duration"
                  value={event.duration}
                  onChange={(e) => handleEventChange(e, index)}
                  placeholder="Duration"
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="text"
                  name="location"
                  value={event.location}
                  onChange={(e) => handleEventChange(e, index)}
                  placeholder="Location"
                />
              </Col>
            </Row>
          ))}
          <Button variant="secondary" onClick={handleAddEvent}>
            Add Event
          </Button>
        </Form.Group>

        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
  </Form>
</Container>

  );
};

export default OnboardingPage;