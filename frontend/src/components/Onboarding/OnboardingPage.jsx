import React, { useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { Alert, Form, Button, Container, Col, Table, Card, Accordion } from 'react-bootstrap';

import { registerAll } from '../../features/auth/authSlice'

const DAYS_OF_WEEK = {
  Sunday: 'Sun',
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
};

const OwnerOrAdminStep = ({ isOwnerOrAdmin, handleOwnerOrAdminChange, organizationName, handleOrganizationNameChange }) => {
  return (
    <Accordion.Item eventKey="0">
      <Accordion.Header>Step 1: Are you a business owner or administrator?</Accordion.Header>
      <Accordion.Collapse eventKey="0">
        <Accordion.Body>
          <Form.Check
            type="checkbox"
            label="Yes, I am a business owner or administrator."
            checked={isOwnerOrAdmin}
            onChange={handleOwnerOrAdminChange}
          />
          <Form.Group>
            <Form.Label>Organization Name</Form.Label>
            <Form.Control type="text" value={organizationName} onChange={handleOrganizationNameChange} />
          </Form.Group>
        </Accordion.Body>
      </Accordion.Collapse>
    </Accordion.Item>
  );
};

const EmployeeStep = ({ newEmployee, handleNewEmployeeChange, handleAddEmployee, employees, handleDeleteEmployee }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    if (form.checkValidity()) {
      handleAddEmployee();
    } else {
      form.reportValidity();
    }
  };

  return (
    <Accordion.Item eventKey="1">
      <Accordion.Header>Step 2: Add employees to your organization.</Accordion.Header>
      <Accordion.Collapse eventKey="1">
        <Accordion.Body>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Add Employee</Form.Label>
              <Form.Control type="text" name="firstName" value={newEmployee.firstName} onChange={handleNewEmployeeChange} placeholder="First Name" minLength={2} maxLength={50} required/>
              <Form.Control type="text" name="lastName" value={newEmployee.lastName} onChange={handleNewEmployeeChange} placeholder="Last Name" minLength={2} maxLength={50} required/>
              <Form.Control type="email" name="email" value={newEmployee.email} onChange={handleNewEmployeeChange} placeholder="Email" required/>
              <Button type="submit">Add Employee</Button>
            </Form.Group>
          </Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={index}>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td><Button variant="danger" onClick={() => handleDeleteEmployee(index)}>Delete</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion.Collapse>
    </Accordion.Item>
  );
};

const ScheduleStep = ({ employeeSchedules, setEmployeeSchedules, employees }) => {
  const [errors, setErrors] = useState([]);

  const handleScheduleChange = (employeeIndex, dayOfWeek, field, value) => {
    const newSchedules = [...employeeSchedules];
    const schedule = newSchedules[employeeIndex][dayOfWeek];
    let roundedValue = value;
  
    if (field === 'startTime' || field === 'endTime') {
      const time = new Date(`2000-01-01T${value}`);
      const roundedMinutes = Math.round(time.getMinutes() / 30) * 30;
      time.setMinutes(roundedMinutes);
      roundedValue = time.toTimeString().substring(0, 5);
    }
  
    newSchedules[employeeIndex][dayOfWeek] = {
      ...schedule,
      [field]: roundedValue,
    };
  
    // check if start time is after end time, and vice versa
    const start = new Date(`2000-01-01T${newSchedules[employeeIndex][dayOfWeek].startTime}`);
    const end = new Date(`2000-01-01T${newSchedules[employeeIndex][dayOfWeek].endTime}`);

    if (field === 'startTime' && schedule.endTime && start >= end) {
      newSchedules[employeeIndex][dayOfWeek] = {
        ...schedule,
        startTime: schedule.endTime,
      };
      setErrors([
        ...errors.filter((error) => !error.includes(DAYS_OF_WEEK[dayOfWeek])),
        `${DAYS_OF_WEEK[dayOfWeek]} start time should be before end time.`,
      ]);
    } else if (field === 'endTime' && schedule.startTime && start >= end) {
      newSchedules[employeeIndex][dayOfWeek] = {
        ...schedule,
        endTime: schedule.startTime,
      };
      setErrors([
        ...errors.filter((error) => !error.includes(DAYS_OF_WEEK[dayOfWeek])),
        `${DAYS_OF_WEEK[dayOfWeek]} end time should be after start time.`,
      ]);
    } else if ((field === 'startTime' || field === 'endTime') && schedule.startTime && schedule.endTime && roundedValue === schedule.endTime) {
      newSchedules[employeeIndex][dayOfWeek] = {
        ...schedule,
        startTime: '',
      };
      setErrors([
        ...errors.filter((error) => !error.includes(DAYS_OF_WEEK[dayOfWeek])),
        `${DAYS_OF_WEEK[dayOfWeek]} start time cannot be the same as end time.`,
      ]);
    } else if ((field === 'startTime' || field === 'endTime') && schedule.startTime && schedule.endTime && roundedValue === schedule.startTime) {
      newSchedules[employeeIndex][dayOfWeek] = {
        ...schedule,
        endTime: '',
      };
      setErrors([
        ...errors.filter((error) => !error.includes(DAYS_OF_WEEK[dayOfWeek])),
        `${DAYS_OF_WEEK[dayOfWeek]} end time cannot be the same as start time.`,
      ]);
    } else {
      setErrors(errors.filter((error) => !error.includes(DAYS_OF_WEEK[dayOfWeek])));
    }
    
    setEmployeeSchedules(newSchedules);
  };
  
  const handleCheckboxChange = (employeeIndex, dayOfWeek, isChecked) => {
    handleScheduleChange(employeeIndex, dayOfWeek, 'isChecked', isChecked);
  }

  return (
    <Accordion.Item eventKey="2">
      <Accordion.Header>Step 3: Set a basic schedule for each employee.</Accordion.Header>
      <Accordion.Collapse eventKey="2">
        <Accordion.Body>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Employee Name</th>
                {Object.values(DAYS_OF_WEEK).map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={index}>
                  <td>{`${employee.firstName} ${employee.lastName}`}</td>
                  {Object.keys(DAYS_OF_WEEK).map((dayOfWeek) => {
                    const schedule = employeeSchedules[index][dayOfWeek];
                    return (
                      <td key={`${employee.firstName}-${dayOfWeek}`}>
                        <div>
                          <Form.Check 
                            type="checkbox" 
                            label={DAYS_OF_WEEK[dayOfWeek]}
                            checked={schedule.isChecked}
                            onChange={(event) => handleCheckboxChange(index, dayOfWeek, event.target.checked)}
                          />
                        </div>
                        {schedule.isChecked && (
                          <>
                            <div>
                              <Form.Label>Start Time:</Form.Label>
                              <Form.Control
                                type="time"
                                value={schedule.startTime}
                                onChange={(event) => handleScheduleChange(index, dayOfWeek, 'startTime', event.target.value)}
                              />
                            </div>
                            <div>
                              <Form.Label>End Time:</Form.Label>
                              <Form.Control
                                type="time"
                                value={schedule.endTime}
                                onChange={(event) => handleScheduleChange(index, dayOfWeek, 'endTime', event.target.value)}
                              />
                            </div>
                            {errors
                              .filter((error) => error.includes(DAYS_OF_WEEK[dayOfWeek]))
                              .map((error, index) => (
                                <Alert key={`${employee.firstName}-${dayOfWeek}-error-${index}`} variant="danger">{error}</Alert>
                              ))}
                          </>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion.Collapse>
    </Accordion.Item>
  );
};

const ReviewStep = ({ isOwnerOrAdmin, organizationName, employees, employeeSchedules }) => {
  const renderEmployeeSchedule = (schedule) => {
    return (
      <Table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(schedule).map(([day, details]) => {
            if (details.isChecked) {
              return (
                <tr key={day}>
                  <td>{DAYS_OF_WEEK[day]}</td>
                  <td>{details.startTime}</td>
                  <td>{details.endTime}</td>
                </tr>
              );
            } else {
              return null;
            }
          })}
        </tbody>
      </Table>
    );
  };

  return (
    <Accordion.Item eventKey="3">
      <Accordion.Header>Step 4: Review your input.</Accordion.Header>
      <Accordion.Collapse eventKey="3">
        <Accordion.Body>
          <h4>Are you a business owner or administrator?</h4>
          <p>{isOwnerOrAdmin ? 'Yes' : 'No'}</p>

          {isOwnerOrAdmin && (
            <>
              <h4>Organization Name</h4>
              <p>{organizationName}</p>
            </>
          )}

          <h4>Employees</h4>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={index}>
                  <td>{`${employee.firstName} ${employee.lastName}`}</td>
                  <td>{employee.email}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h4>Schedules</h4>
          {employees.map((employee, index) => (
            <div key={index}>
              <h5>{`${employee.firstName} ${employee.lastName}`}</h5>
              {renderEmployeeSchedule(employeeSchedules[index])}
            </div>
          ))}
        </Accordion.Body>
      </Accordion.Collapse>
    </Accordion.Item>
  );
};

const OnboardingPage = () => {
  const user = useSelector(state => state.auth.user);

  const [isOwnerOrAdmin, setIsOwnerOrAdmin] = useState(false);
  const [organizationName, setOrganizationName] = useState('');
  const [newEmployee, setNewEmployee] = useState({ firstName: '', lastName: '', email: '' });
  const [employees, setEmployees] = useState([]);
  const [employeeSchedules, setEmployeeSchedules] = useState([]);
  const [step, setStep] = useState(0);

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleOwnerOrAdminChange = (event) => {
    setIsOwnerOrAdmin(event.target.checked);
  };

  const handleOrganizationNameChange = (event) => {
    setOrganizationName(event.target.value);
  };

  const handleNewEmployeeChange = (event) => {
    const { name, value } = event.target;
    setNewEmployee((prevEmployee) => ({ ...prevEmployee, [name]: value }));
  };

  const handleAddEmployee = () => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    setEmployeeSchedules((prevSchedules) => [...prevSchedules, { ...DAYS_OF_WEEK }]);
    setNewEmployee({ firstName: '', lastName: '', email: '' });
  };

  const handleDeleteEmployee = (index) => {
    setEmployees((prevEmployees) => prevEmployees.filter((_, i) => i !== index));
    setEmployeeSchedules((prevSchedules) => {
      const newSchedules = [...prevSchedules];
      newSchedules.splice(index, 1);
      return newSchedules;
    });
  };

  const handleScheduleChange = (e, employeeIndex, dayOfWeek) => {
    const scheduleIndex = employeeSchedules.findIndex((schedule) => schedule.dayOfWeek === DAYS_OF_WEEK && schedule.employeeIndex === employeeIndex);
    const newSchedules = [...employeeSchedules];
    if (scheduleIndex !== -1) {
      newSchedules.splice(scheduleIndex, 1);
    }
    if (e.target.checked) {
      newSchedules.push({
        employeeIndex,
        dayOfWeek,
        startTime: '',
        endTime: '',
      });
    }
    setEmployeeSchedules(newSchedules);
  };

  const handleTimeChange = (e, employeeIndex, dayOfWeek, field) => {
    const scheduleIndex = employeeSchedules.findIndex((schedule) => schedule.dayOfWeek === dayOfWeek && schedule.employeeIndex === employeeIndex);
    const newSchedules = [...employeeSchedules];
    if (scheduleIndex !== -1) {
      newSchedules[scheduleIndex] = {
        ...newSchedules[scheduleIndex],
        [field]: e.target.value,
      };
      setEmployeeSchedules(newSchedules);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isStepValid()) {
      // Dispatch the registerAll action or perform any necessary API calls here
      const orgName = organizationName;
      const data = {
        user,
        orgName,
        employees: employees.map((employee) => ({
          first_name: employee.firstName,
          last_name: employee.lastName,
          email: employee.email,
        })),
        employeeSchedules: employeeSchedules.map((schedule) => {
          const { Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday } = schedule;
  
          return {
            Monday: Monday.startTime && Monday.endTime ? { startTime: Monday.startTime, endTime: Monday.endTime } : null,
            Tuesday: Tuesday.startTime && Tuesday.endTime ? { startTime: Tuesday.startTime, endTime: Tuesday.endTime } : null,
            Wednesday: Wednesday.startTime && Wednesday.endTime ? { startTime: Wednesday.startTime, endTime: Wednesday.endTime } : null,
            Thursday: Thursday.startTime && Thursday.endTime ? { startTime: Thursday.startTime, endTime: Thursday.endTime } : null,
            Friday: Friday.startTime && Friday.endTime ? { startTime: Friday.startTime, endTime: Friday.endTime } : null,
            Saturday: Saturday.startTime && Saturday.endTime ? { startTime: Saturday.startTime, endTime: Saturday.endTime } : null,
            Sunday: Sunday.startTime && Sunday.endTime ? { startTime: Sunday.startTime, endTime: Sunday.endTime } : null,
          };
        }),
      };

      console.log({
        data
      });

      dispatch(registerAll(data))
        .then((response) => {
          // Check for errors in the response
          if (response.error) {
            // Handle the error returned by the backend
            console.log('Backend error:', response.error);
            // Display an error message or handle the error in an appropriate way
            alert('An error occurred while submitting the form. Please try again later.');
          } else {
            // Submission was successful
            // Redirect to a success page or display a success message

            // navigate('/home');
          }
        })
        .catch((error) => {
          // Handle dispatch or network error
          console.log('Error:', error);
          // Display an error message or handle the error in an appropriate way
          alert('An error occurred while submitting the form. Please try again later.');
        });
    } else {
      alert('Please fill out all required fields before submitting.');
    }
  };

  /*
  const handleSubmit = () => {
    // submit data to server
    const initEvents = employees.map((employee) => {
      return {
        calendarId: employee.id,
        category: 'time',
        isVisible: true,
        title: 'Work',
        id: employee.id,
        body: 'Work Schedule',
        start: employeeSchedules[employee.id]?.Sunday?.start,
        end: employeeSchedules[employee.id]?.Sunday?.end,
      };
    });

    const calendarData = {
      userId: '6438f8eea5398febfc3e8abd',
      events: initEvents,
    };

    console.log(calendarData);
  };
  */

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 0:
        return organizationName !== "" && isOwnerOrAdmin !== false;
      case 1:
        return employees.length > 0;
      case 2:
        return employeeSchedules.every((employeeSchedule) => {
          return Object.keys(employeeSchedule).some((dayOfWeek) => {
            const schedule = employeeSchedule[dayOfWeek];
            return (
              schedule.isChecked &&
              schedule.startTime &&
              schedule.endTime &&
              schedule.startTime !== schedule.endTime &&
              Object.values(employeeSchedule).some(
                (schedule) =>
                  schedule.isChecked &&
                  schedule.startTime &&
                  schedule.endTime &&
                  schedule.startTime !== schedule.endTime
              )
            );
          });
        });
      default:
        return true;
    }
  };  

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <OwnerOrAdminStep
            isOwnerOrAdmin={isOwnerOrAdmin}
            handleOwnerOrAdminChange={handleOwnerOrAdminChange}
            organizationName={organizationName}
            handleOrganizationNameChange={handleOrganizationNameChange}
            handleNext={handleNext}
          />
        );
      case 1:
        return (
          <EmployeeStep
            newEmployee={newEmployee}
            handleNewEmployeeChange={handleNewEmployeeChange}
            handleAddEmployee={handleAddEmployee}
            employees={employees}
            handleDeleteEmployee={handleDeleteEmployee}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        );
      case 2:
        return (
          <ScheduleStep
            employeeSchedules={employeeSchedules}
            setEmployeeSchedules={setEmployeeSchedules}
            employees={employees}
            handleScheduleChange={handleScheduleChange}
            handleTimeChange={handleTimeChange}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <ReviewStep
            isOwnerOrAdmin={isOwnerOrAdmin}
            organizationName={organizationName}
            employees={employees}
            employeeSchedules={employeeSchedules}
            handlePrevious={handlePrevious}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Card>
        <Card.Header>Employee Scheduler</Card.Header>
        <Card.Body>
          <Accordion>{renderStep()}</Accordion>
          <div style={{ marginTop: "1rem" }}>
            {step > 0 && (
              <Button variant="secondary" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!isStepValid()}
                style={{ marginLeft: "1rem" }}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={!isStepValid()}
                style={{ marginLeft: "1rem" }}
              >
                Submit
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default OnboardingPage
