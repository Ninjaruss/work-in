import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const OnboardingPage = () => {
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
    <Container>
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

        {isOwner && (
          <>
            <h2>Member Information</h2>
            <Row>
              {members.map((member, index) => (
                <Col key={index}>
                  <Form.Group>
                    <Form.Label>Member #{index + 1}</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={member.fullName}
                      onChange={(e) => handleMemberChange(e, index)}
                      placeholder="Full Name"
                    />
                    <Form.Control
                      type="email"
                      name="email"
                      value={member.email}
                      onChange={(e) => handleMemberChange(e, index)}
                      placeholder="Email"
                    />
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={member.phone}
                      onChange={(e) => handleMemberChange(e, index)}
                      placeholder="Phone"
                    />
                    <Form.Control
                      type="text"
                      name="position"
                      value={member.position}
                      onChange={(e) => handleMemberChange(e, index)}
                      placeholder="Position"
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
            <Button onClick={handleAddMember}>Add Member</Button>
          </>
        )}

        {members.length > 0 && (
          <>
            <h2>Timeslot Schedule (Events)</h2>
            <Row>
              {events.map((event, index) => (
                <Col
                    key={index}
                >
                  <Form.Group>
                    <Form.Label>Event #{index + 1}</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={event.date}
                      onChange={(e) => handleEventChange(e, index)}
                      placeholder="Date"
                    />
                    <Form.Control
                      type="time"
                      name="time"
                      value={event.time}
                      onChange={(e) => handleEventChange(e, index)}
                      placeholder="Time"
                    />
                    <Form.Control
                      type="text"
                      name="duration"
                      value={event.duration}
                      onChange={(e) => handleEventChange(e, index)}
                      placeholder="Duration"
                    />
                    <Form.Control
                      type="text"
                      name="location"
                      value={event.location}
                      onChange={(e) => handleEventChange(e, index)}
                      placeholder="Location"
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </>
        )}

        {(isOwner || members.length > 0) && (
          <Button onClick={handleSubmit} className="mt-3">
            Submit
          </Button>
        )}
      </Form>
    </Container>
  );
};

export default OnboardingPage;