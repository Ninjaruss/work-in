import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateEventModal = ({ show, handleClose, handleCreateEvent }) => {
  const [title, setTitle] = useState('');
  const [calendarId, setCalendarId] = useState('personal');
  const [isAllDay, setIsAllDay] = useState(false);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  const handleStartChange = (date) => {
    setStart(date);
    if (end < date) {
      setEnd(date);
    }
  };

  const handleEndChange = (date) => {
    setEnd(date);
    if (date < start) {
      setStart(date);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newEvent = {
      calendarId: calendarId,
      category: 'time',
      id: String(Math.random()),
      isAllDay: isAllDay,
      isVisible: true,
      title: title,
      start: start,
      end: end,
      body: '',
    };

    handleCreateEvent(newEvent);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCalendar">
            <Form.Label>Calendar</Form.Label>
            <Form.Control
              as="select"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
            >
              <option value="personal">Personal</option>
              <option value="company">Company</option>
              <option value="available">Available</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formIsAllDay">
            <Form.Check
              type="checkbox"
              label="All day event"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
            />
          </Form.Group>
          <Form.Group controlId="formStart">
            <Form.Label>Start Date</Form.Label>
            <br />
            <DatePicker selected={start} onChange={handleStartChange} showTimeSelect />
          </Form.Group>
          <Form.Group controlId="formEnd">
            <Form.Label>End Date</Form.Label>
            <br />
            <DatePicker selected={end} onChange={handleEndChange} showTimeSelect />
          </Form.Group>
          <Button variant="primary" type="submit">
            Create
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateEventModal;