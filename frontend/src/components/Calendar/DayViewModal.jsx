import React, { useRef, useState, useEffect, useCallback } from "react";
import { useSelector } from 'react-redux';
import {Button, ButtonGroup, Form, Container, Row, Col, Modal, Card} from "react-bootstrap";
import './CalendarModals.css';

/* ES6 module in Node.js environment */
import TuiCalendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css'; // Stylesheet for calendar
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

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

const DayViewModal = (props) => {
    const user = useSelector(state => state.auth.user);

    const cal = useRef(null);
    const [calendars, setCalendars] = useState(initCalendars);
    const [events, setEvents] = useState([]);
    const [eventsInitialized, setEventsInitialized] = useState(false);
    
    // Toggle filters
    const [personalEnabled, setPersonalEnabled] = useState(true);
    const [companyEnabled, setCompanyEnabled] = useState(false);
    const [availableEnabled, setAvailableEnabled] = useState(false);

    const [selectedEvent, setSelectedEvent] = useState(null);

    // Add new time from selected/highlighted slot button
    const [showPrompt, setShowPrompt] = useState(false);
    const [title, setTitle] = useState("");
    const [calendarId, setCalendarId] = useState("personal");
    const [isAllDay, setIsAllDay] = useState(false);
    const [body, setBody] = useState("");

    useEffect(() => {
        if (user) {
            // init new test calendar
            calendarData.userId = user._id;
            createCalendar(calendarData)
            .then(calendar => {
              console.log('Calendar created:', calendar);
            })
            .catch(error => {
              console.error(error);
            });
            
            // Fetch calendars from calendarService
            getCalendarByUserId(user._id)
                .then(calendar => {
                    setEventsInitialized(false); // Set the flag to false after initial events data is fetched
                    setEvents(calendar.events);
                })
                .catch(error => console.error('Error fetching calendars:', error));
        }
    }, [user.id]);
    
    const onClickEvent = useCallback((e) => {
        const { calendarId, id, title, isAllDay, body } = e.event;
        const el = cal.current.getInstance().getElement(id, calendarId);

        console.log("clicked event:", e.event);

        cal.current.getInstance().clearGridSelections();
        setSelectedEvent(e.event);

        if (title) {
            setTitle(title);
        }

        if (calendarId) {
            setCalendarId(calendarId);
        }

        if (isAllDay !== undefined) {
            setIsAllDay(isAllDay);
        }

        if (body) {
            setBody(body);
        }

      }, [cal, setTitle, setCalendarId, setIsAllDay, setBody]);
    
    const onSelectDateTime = useCallback((eventData) => {
        setSelectedEvent(eventData);
    });

    // Save calendar whenever the events state changes; ignores first 2 sets (init of events and fetching of events from database)
    useEffect(() => {  
        if (eventsInitialized) {
            // Perform any actions that depend on the updated events state here
            console.table(events);

            const updatedCalendarData = {userId: user._id, events: events};

            updateCalendarByUserId(user._id, updatedCalendarData)
                .catch(error => console.error('Error saving calendar:', error));

        } else {
            // If events state is not initialized, set the flag to true
            setEventsInitialized(true);
        }
    }, [events]); 

    const onBeforeCreateEvent = useCallback((eventData) => {
        console.log("createEvent:" + eventData);

        const event = {
          calendarId: eventData.calendarId ?? "personal",
          id: String(uuidv4()),
          title: eventData.title,
          isAllDay: eventData.isAllDay,
          start: eventData.start,
          end: eventData.end,
          category: eventData.isAllDay ? "allday" : "time",
          // dueDateClass: "",
          body: eventData.body,
          location: eventData.location,
          /*raw: {
            class: eventData.raw["class"]
          },*/
          state: eventData.state
        };

        cal.current.getInstance().createEvents([event]);

        setEvents(prevEvents => {
            // Return the updated events array, including the new event
            const updatedEvents = [...prevEvents, event];
            return updatedEvents;
        });
    }, []);

    const onBeforeDeleteEvent = useCallback((res) => {
        // Replace with API call; replace parameter with res
        const { id, calendarId } = res;
        console.log("deleteEvent:");
        console.log(id);
        console.table(events)
        console.log("delete end")

        // Update events state
        setEvents(prevEvents => {
            // Find index of event to delete
            const index = prevEvents.findIndex(event => event.id === id && event.calendarId === calendarId);
            // If event found, remove it from events array
            if (index !== -1) {
            const updatedEvents = [...prevEvents];
            updatedEvents.splice(index, 1);
            return updatedEvents;
            }
            return prevEvents;
        });

        cal.current.getInstance().deleteEvent(id, calendarId)
    }, []);
    
    const onBeforeUpdateEvent = useCallback((e) => {
        console.log("updateEvent:" + e.event);

        const { event, changes } = e;

        cal.current.getInstance().updateEvent(
            event.id,
            event.calendarId,
            changes
        );

        // Convert start and end properties to ISO string format
        let updatedChanges = { ...changes };
        if (changes.start && changes.start.d) {
            updatedChanges.start = new Date(changes.start.d).toISOString();
        }
        if (changes.end && changes.end.d) {
            updatedChanges.end = new Date(changes.end.d).toISOString() ;
        }
        console.log("Changes")
        console.table(changes)
        console.log("updatedChanges")
        console.table(updatedChanges)

        // Update events state
        setEvents(prevEvents => {
            // Find index of event to update
            const index = prevEvents.findIndex(ev => ev.id === event.id && ev.calendarId === event.calendarId);
            // If event found, update it in events array
            if (index !== -1) {
            const updatedEvents = [...prevEvents];
            
            updatedEvents[index] = { ...updatedEvents[index], ...updatedChanges };
            return updatedEvents;
            }
            return prevEvents;
        });
        
    }, []);
    
    const handleCreateEvent = () => {
        if (!title || !body) {
            alert("Please fill in the required fields");
            return;
        }

        console.log("isAllDay:", isAllDay)

        const newEvent = {
            calendarId: calendarId,
            category: "time",
            // id: String(Math.random()), id already set in beforeCreateEvent
            isAllDay: isAllDay,
            isVisible: true,
            title: title,
            start: selectedEvent.start.toISOString(),
            end: selectedEvent.end.toISOString(),
            body: body,
        };

        cal.current.getInstance().fire("beforeCreateEvent", newEvent);
        setSelectedEvent(null);
        cal.current.getInstance().clearGridSelections();

        setTitle("");
        setBody("");
        setCalendarId("personal");
        setIsAllDay(false);
    };

    const handleUpdateEvent = () => {
        if (!selectedEvent || !title || !body) {
          alert("Please select an event and fill in the required fields");
          return;
        }

        // Create the updated event
        const updatedEvent = {
          id: String(uuidv4()),
          calendarId: calendarId,
          category: "time",
          title: title,
          isAllDay: isAllDay,
          start: new Date(selectedEvent.start.d).toISOString(),
          end: new Date(selectedEvent.end.d).toISOString(),
          body: body,
        };

        cal.current.getInstance().fire("beforeDeleteEvent", selectedEvent);

        cal.current.getInstance().fire("beforeCreateEvent", updatedEvent);

        // setSelectedEvent(null);
        cal.current.getInstance().clearGridSelections();
        
        // Reset form fields and selected event
        setTitle("");
        setCalendarId("personal");
        setIsAllDay(false);
        setBody("");
        
      };

    const handleDeleteEvent = () => {
        cal.current.getInstance().fire("beforeDeleteEvent", selectedEvent);
    }

    useEffect(() => {
        if (cal.current) {
            // Update calendar properties
            cal.current.getInstance().setOptions({
                week: {
                    showNowIndicator: false,
                    eventView: ['time'],
                    taskView: false,
                    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                },
                template: {
                    weekDayName(model) {
                        return `<Container><h6 class="text-center"><span>${model.date}</span>&nbsp;&nbsp;<b>${model.dayName}</b></h6></Container>`;
                        //return `<span>${model.date}</span>&nbsp;&nbsp;<span>${model.dayName}</span>`;
                    },
                },
            });
            cal.current.getInstance().setDate(props.date.toLocaleDateString());
            cal.current.getInstance().scrollToNow();
        }
    }, [cal, props.date]);

    const handleSwitchView = () => {
        const currentView = cal.current.getInstance().getViewName();
        if (currentView==='day'){
            cal.current.getInstance().changeView('week');
        } else {
            cal.current.getInstance().changeView('day');
        }
        cal.current.getInstance().setDate(props.date.toLocaleDateString());
    }

    // Filter form toggles
    const handleToggle = (toggleName, toggleValue) => {
        const enabledCount = [personalEnabled, companyEnabled, availableEnabled].filter(Boolean).length;

        if (toggleValue === true || enabledCount > 1) {
            switch (toggleName) {
                case 'personal':
                    cal.current.getInstance().setCalendarVisibility('personal', toggleValue);
                    setPersonalEnabled(toggleValue);
                    break;
                case 'company':
                    cal.current.getInstance().setCalendarVisibility('company', toggleValue);
                    setCompanyEnabled(toggleValue);
                    break;
                case 'available':
                    cal.current.getInstance().setCalendarVisibility('available', toggleValue);
                    setAvailableEnabled(toggleValue);
                    break;
                default:
                    break;
            }
        }
    };

    useEffect(() => {
        const updatedCalendars = [];
      
        if (personalEnabled) {
          updatedCalendars.push({
            id: 'personal',
            name: 'Personal',
            bgColor: '#9e5fff',
            borderColor: '#9e5fff'
          });
        }
      
        if (companyEnabled) {
          updatedCalendars.push({
            id: 'company',
            name: 'Company',
            bgColor: '#ffc939',
            borderColor: '#ffc939'
          });
        }
      
        if (availableEnabled) {
          updatedCalendars.push({
            id: 'available',
            name: 'Available',
            bgColor: '#1cb3c8',
            borderColor: '#1cb3c8'
          });
        }
      
        setCalendars(updatedCalendars);
    }, [personalEnabled, companyEnabled, availableEnabled]);
    
    /*
    React Variables exported to Calendar
    const [dayView, setShowDay] = useState(false);
    const handleCloseDay = () => setShowDay(false);
    const handleShowDay = () => setShowDay(true); 
    */
    return (
        <Modal show={props.dayView} onHide={props.handleCloseDay} dialogClassName="dayview-modal" size="lg" centered>
            <Modal.Header closeButton>
            </Modal.Header>

            <Modal.Body>
                <Container>
                    <Row>
                        <Col sm={1}>
                            <h4>Filters</h4>
                            <Form className="text-left">
                                <Form.Check
                                    type="switch"
                                    id="personal-switch"
                                    label="Personal"
                                    checked={personalEnabled}
                                    onChange={(e) => handleToggle('personal', e.target.checked)}
                                />
                                <Form.Check
                                    type="switch"
                                    id="company-switch"
                                    label="Company"
                                    checked={companyEnabled}
                                    onChange={(e) => handleToggle('company', e.target.checked)}
                                />
                                <Form.Check
                                    type="switch"
                                    id="available-switch"
                                    label="Available"
                                    checked={availableEnabled}
                                    onChange={(e) => handleToggle('available', e.target.checked)}
                                    disabled={!personalEnabled && !companyEnabled && !availableEnabled}
                                />
                            </Form>

                            <h4>Options</h4>
                            <Button variant="info" onClick={handleSwitchView}>
                                Switch View
                            </Button>
                        </Col>

                        <Col sm={8} className="text-left">
                            <TuiCalendar
                                ref={cal}
                                height="500px"
                                view="day"
                                useFormPopup={false}
                                useCreationPopup={true}
                                useDetailPopup={false}
                                calendars={calendars}
                                events={events}
                                onClickEvent={onClickEvent}
                                onBeforeCreateEvent={onBeforeCreateEvent}
                                onBeforeDeleteEvent={onBeforeDeleteEvent}
                                onBeforeUpdateEvent={onBeforeUpdateEvent}
                                onSelectDateTime={onSelectDateTime}
                            />
                        </Col>
                        <Col sm={3}>
                            <Form>
                                <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                                </Form.Group>
                                <Form.Group>
                                <Form.Label>Calendar</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={calendarId}
                                    onChange={(e) => setCalendarId(e.target.value)}
                                    name="calendarId"
                                    required
                                >
                                    <option value="personal">Personal</option>
                                    <option value="company">Company</option>
                                    <option value="available">Available</option>
                                </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                <Form.Check
                                    type="checkbox"
                                    label="All Day"
                                    checked={isAllDay}
                                    onChange={(e) => setIsAllDay(e.target.checked)}
                                    name="isAllDay"
                                />
                                </Form.Group>
                                <Form.Group>
                                <Form.Label>Body</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Enter body"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    required
                                />
                                </Form.Group>
                            </Form>
                            <Row className="mt-3">
                                <ButtonGroup>
                                    {title && calendarId && body && (
                                    <Button variant="outline-dark" onClick={handleCreateEvent}>
                                        Add Event
                                    </Button>
                                    )}
                                    {selectedEvent && title && calendarId && body && (
                                    <Button variant="outline-dark" onClick={handleUpdateEvent}>
                                        Update Event
                                    </Button>
                                    )}
                                    {selectedEvent && title && calendarId && body && (
                                    <Button variant="outline-dark" onClick={handleDeleteEvent}>
                                        Delete Event
                                    </Button>
                                    )}
                                </ButtonGroup>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleCloseDay}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => {
                    if (window.confirm("Are you sure you want to save changes?")) {
                        props.handleCloseDay();
                    }
                }}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    ); 
};

export default DayViewModal