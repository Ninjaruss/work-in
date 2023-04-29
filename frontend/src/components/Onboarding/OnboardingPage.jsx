import React, { useRef, useState, useEffect, useCallback } from "react";
import { useSelector } from 'react-redux';
import { Container, Form, Button, Row, Col, Alert, Table } from 'react-bootstrap';

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

const OnboardingPage = () => {
  const user = useSelector(state => state.auth.user);

  const [isOwner, setIsOwner] = useState(true); // State to track if user is owner or not
  const [accountDetails, setAccountDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: ''
  }); // State to store account details
  const [adminEmail, setAdminEmail] = useState(''); // State to store admin email
  // State for team members
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "", email: "", role: "admin" },
    { id: 2, name: "", email: "", role: "member" },
    // ... add more initial team members as needed
  ]);
  
  const [schedules, setSchedules] = useState([
    {
      memberId: 1,
      day: '',
      timeZone: '',
      // Additional schedule state
    },
    // Additional schedules
  ]);

  const getMemberName = memberId => {
    const member = teamMembers.find(member => member.id === memberId);
    return member ? member.name : '';
  };

  // Define handleTeamMemberInputChange function
  const handleTeamMemberInputChange = (event, memberId) => {
    const { name, value } = event.target;
    setTeamMembers((prevTeamMembers) => {
      return prevTeamMembers.map((member) => {
        if (member.id === memberId) {
          return { ...member, [name]: value };
        }
        return member;
      });
    });
  };

  // Handle input change for schedules
  const handleScheduleInputChange = (event, memberId) => {
    const { name, value } = event.target;
    setSchedules(prevSchedules => {
      return prevSchedules.map(schedule => {
        if (schedule.memberId === memberId) {
          return { ...schedule, [name]: value };
        }
        return schedule;
      });
    });
  };

  const handleConfirmSchedule = async () => {
    try {
      if (isOwner) {
        const calendar = await getCalendarByUserId(user.id);
        if (calendar) {
          // Update existing calendar with the first schedule in the schedules array
          await updateCalendarByUserId(user.id, [schedules[0]]);
        } else {
          await createCalendar({
            userId: user.id,
            schedules
          });
        }
      } else {
        for (const teamMember of teamMembers) {
          const { id, email } = teamMember;
          const calendar = await getCalendarById(id);
          if (calendar) {
            await updateCalendar(id, schedules);
          } else {
            await createCalendar({
              id,
              email,
              schedules
            });
          }
        }
      }
      // Redirect to Dashboard
      // You can implement the redirect logic here
    } catch (error) {
      // Handle error
      console.error('Error confirming schedule:', error);
      // Display error message to user
      // You can implement the error handling logic here
    }
  };

  const handleAddTeamMember = () => {
    // Logic for adding a team member
    const newTeamMember = {
      id: uuidv4(),
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: ''
    };
    setTeamMembers([...teamMembers, newTeamMember]);
  };

  const handleScheduleChange = (event, memberId) => {
    // Logic for handling schedule change
    const { name, value } = event.target;
    setSchedules(prevSchedules => {
      const updatedSchedules = [...prevSchedules];
      const memberIndex = updatedSchedules.findIndex(member => member.memberId === memberId);
      if (memberIndex !== -1) {
        updatedSchedules[memberIndex][name] = value;
      } else {
        updatedSchedules.push({
          memberId,
          day: '',
          timeZone: '',
          [name]: value
        });
      }
      return updatedSchedules;
    });
  };

  const handleInputChange = (event) => {
    // Logic for handling input change in account details
    const { name, value } = event.target;
    setAccountDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  const handleAdminEmailChange = (event) => {
    // Logic for handling input change in admin email
    setAdminEmail(event.target.value);
  };

  // Helper function to get team member by id
  const getTeamMemberById = (memberId) => {
    return teamMembers.find((member) => member.id === memberId);
  };

  // Handle removing a team member
  const handleRemoveTeamMember = (memberId) => {
    setTeamMembers((prevTeamMembers) =>
      prevTeamMembers.filter((member) => member.id !== memberId)
    );
  };

  // Handle adding a new schedule
  const handleAddSchedule = () => {
    const newSchedule = {
      memberId: "", // set memberId to the appropriate value
      day: "", // set day to the appropriate value
      timeZone: "", // set timeZone to the appropriate value
    };
    setSchedules([...schedules, newSchedule]);
  };

  // Handle removing a schedule
  const handleRemoveSchedule = (memberId) => {
      setSchedules((prevSchedules) =>
      prevSchedules.filter((schedule) => schedule.memberId !== memberId));
  };

  // Get events for a specific day and team member
  const getEventsForDay = (memberId, day) => {
    const teamMember = getTeamMemberById(memberId);
    const events = teamMember.events.filter(
      (event) => event.day === day
    );
    return events;
  };

  // Add event for a specific day and team member
  const handleAddEvent = (memberId, day) => {
    const teamMemberIndex = teamMembers.findIndex((teamMember) => teamMember.id === memberId);
    if (teamMemberIndex !== -1) {
      const updatedTeamMembers = [...teamMembers];
      const teamMember = updatedTeamMembers[teamMemberIndex];
      if (!teamMember.events) {
        teamMember.events = {}; // Initialize events property if not defined
      }
      if (!teamMember.events[day]) {
        teamMember.events[day] = []; // Initialize events for the day if not defined
      }
      const newEvent = {
        id: uuidv4(),
        name: 'New Event',
      };
      teamMember.events[day].push(newEvent);
      setTeamMembers(updatedTeamMembers);
    }
  };

  useEffect(() => {
    // Logic to set initial schedules state for team members
    if (teamMembers.length > 0) {
      const initialSchedules = teamMembers.map(member => ({
        memberId: member.id,
        schedules: [{
          id: uuidv4(),
          start: start.toISOString(),
          end: end.toISOString(),
          day: '',
          timeZone: ''
        }]
      }));
      setSchedules(initialSchedules);
    }
  }, [teamMembers]);

  // Render UI for account details
  const renderAccountDetails = () => (
  <Form>
    <Form.Group controlId="firstName">
      <Form.Label>First Name</Form.Label>
      <Form.Control
        type="text"
        name="firstName"
        value={accountDetails.firstName}
        onChange={handleInputChange}
      />
    </Form.Group>
    <Form.Group controlId="lastName">
      <Form.Label>Last Name</Form.Label>
      <Form.Control
        type="text"
        name="lastName"
        value={accountDetails.lastName}
        onChange={handleInputChange}
      />
    </Form.Group>
    <Form.Group controlId="phoneNumber">
      <Form.Label>Phone Number</Form.Label>
      <Form.Control
        type="text"
        name="phoneNumber"
        value={accountDetails.phoneNumber}
        onChange={handleInputChange}
      />
    </Form.Group>
    {/* Additional form fields for account details */}
  </Form>
  );

/// Render UI for team members
const renderTeamMembers = () => (
  <>
    <h2>Team Members</h2>
    {teamMembers.length > 0 && (
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            {/* Additional table headers for team members */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map((teamMember) => (
            <tr key={teamMember.id}>
              <td>
                <Form.Group controlId={`teamMemberName-${teamMember.id}`}>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    value={teamMember.name}
                    onChange={(event) => handleTeamMemberInputChange(event, teamMember.id)}
                  />
                </Form.Group>
              </td>
              <td>
                <Form.Group controlId={`teamMemberEmail-${teamMember.id}`}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={teamMember.email}
                    onChange={(event) => handleTeamMemberInputChange(event, teamMember.id)}
                  />
                </Form.Group>
              </td>
              <td>
                <Form.Group controlId={`teamMemberRole-${teamMember.id}`}>
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    as="select"
                    name="role"
                    value={teamMember.role}
                    onChange={(event) => handleTeamMemberInputChange(event, teamMember.id)}
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </Form.Control>
                </Form.Group>
              </td>
              {/* Additional table cells for team members */}
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleRemoveTeamMember(teamMember.id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
    {/* Additional UI components for team members */}
    <Button variant="primary" onClick={handleAddTeamMember}>
      Add Team Member
    </Button>
  </>
);

  // Render UI for schedules
const renderSchedules = () => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <>
      <h2>Schedules</h2>
      {teamMembers.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>Team Member</th>
              {daysOfWeek.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((teamMember) => (
              <tr key={teamMember.id}>
                <td>{teamMember.name}</td>
                {daysOfWeek.map((day) => (
                  <td key={day}>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddEvent(teamMember.id, day)}
                    >
                      Add Event
                    </Button>
                    <ul>
                      {schedules
                        .filter((schedule) => schedule.memberId === teamMember.id && schedule.day === day)
                        .map((schedule) => (
                          <li key={schedule.id}>{schedule.eventName}</li>
                        ))}
                    </ul>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};
    
  // Render the complete onboarding page UI
  return (
    <div>
      {renderAccountDetails()}
      {renderTeamMembers()}
      {renderSchedules()}
      {/* Additional UI components for the onboarding page */}
    </div>
  );
};

export default OnboardingPage;