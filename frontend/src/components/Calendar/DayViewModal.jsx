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

    getCalendarsByOrganizationId ,
    updateCalendarByOrganizationId,

    deleteCalendarByUserId,
  } from '../../features/calendarService';

const start = new Date();
const end = new Date(new Date().setMinutes(start.getMinutes() + 30));

const initCalendars = ([
    { id: 'personal', name: 'Personal', bgColor: '#9e5fff', borderColor: '#9e5fff' },
    { id: 'organization', name: 'Organization', bgColor: '#ffc939', borderColor: '#ffc939' },
    { id: 'available', name: 'Available', bgColor: '#1cb3c8', borderColor: '#1cb3c8' },
  ]);

/*
const initCalendars = [{ id: '1', name: 'Personal'},{ id: '2', name: 'Organization' }, { id: '3', name: 'Available' }];

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

*/

const DayViewModal = (props) => {
    const user = useSelector(state => state.auth.user);
    const organizationId = user?.organization; // Assuming user's organization ID is stored in user object

    const cal = useRef(null);
    const [calendars, setCalendars] = useState(initCalendars);
    const [events, setEvents] = useState([]);
    const [eventsInitialized, setEventsInitialized] = useState(false);
    
    // Toggle filters
    const [personalEnabled, setPersonalEnabled] = useState(true);
    const [organizationEnabled, setOrganizationEnabled] = useState(false);
    const [availableEnabled, setAvailableEnabled] = useState(false);

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null); // date selected from the regular React calendar (props.date)

    const [eventId, setEventId] = useState("");

    // Add new time from selected/highlighted slot button
    const [showPrompt, setShowPrompt] = useState(false);
    const [title, setTitle] = useState("");
    const [calendarId, setCalendarId] = useState("personal");
    const [isAllDay, setIsAllDay] = useState(false);
    const [body, setBody] = useState("");

    useEffect(() => {
        if (user && organizationId) {
            /*
            // init new test calendar
            calendarData.userId = user._id;
            createCalendar(calendarData)
            .then(calendar => {
              console.log('Calendar created:', calendar);
            })
            .catch(error => {
              console.error(error);
            });
            */
            
            
            /*
            // Fetch calendars from calendarService
            getCalendarByUserId(user._id)
                .then(calendar => {
                    setEventsInitialized(false); // Set the flag to false after initial events data is fetched
                    setEvents(calendar.events);
                })
                .catch(error => console.error('Error fetching calendars:', error));
            */

        // Fetch events from the user's personal calendar
        console.log("getCalendarByUserId")
        getCalendarByUserId(user._id)
        .then(userCalendar => {
            setEventsInitialized(false);

            // Fetch events from the organization's calendar
            getCalendarsByOrganizationId(organizationId) // Updated to fetch all organization calendars
                .then(orgCalendars => {
                    // Create an array to store all organization events
                    const orgEvents = [];
                    
                    // Iterate through each organization calendar and fetch its events
                    orgCalendars.forEach(orgCalendar => {
                        // Check if the calendar belongs to the logged-in user's organization
                        if (orgCalendar.userId === user._id) {
                        // Skip this calendar as it belongs to the same user
                        return;
                        }
                        
                        orgEvents.push(...orgCalendar.events.map(event => ({
                        ...event,
                        calendarId: 'organization',
                        })));
                    });

                    // Filter events for personal and organization categories
                    const userEvents = userCalendar.events.map(event => ({
                        ...event,
                        calendarId: 'personal', // Categorize user's events
                    }));

                    // Combine and set events
                    const combinedEvents = [...userEvents, ...orgEvents];
                    console.log("--combinedEvents--")
                    console.table(combinedEvents)
                    setEvents(combinedEvents);
                })
            .catch(error => console.error('Error fetching organization calendar:', error));
        })
            .catch(error => console.error('Error fetching user calendar:', error));
        }
    }, [user, cal, organizationId]);

    
    const onClickEvent = useCallback((e) => {
        const { calendarId, id, title, isAllDay, body } = e.event;
        const el = cal.current.getInstance().getElement(id, calendarId);

        console.log("clicked event:", e.event);

        cal.current.getInstance().clearGridSelections();
        setSelectedEvent(e.event);

        if (title) {
            setTitle(title);
        }

        if (id) {
            setEventId(id);
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

      }, [cal, setTitle, setEventId, setCalendarId, setIsAllDay, setBody]);
    
    const onSelectDateTime = useCallback((eventData) => {
        setSelectedEvent(eventData);
    });

    // Save calendar whenever the events state changes
    useEffect(() => {
    if (eventsInitialized) {
      // Filter events belonging to the logged-in user's organization
      const eventsToSave = events.filter(event => {
        if (event.calendarId === 'personal') {
          // Always save personal events
          return true;
        } else if (event.calendarId === 'organization') {
          // Save organization events only if they belong to the logged-in user's organization
          return event.userId === user._id;
        }
        // Skip 'available' events for now (modify this logic if needed)
        return false;
      });
  
      // Perform any actions that depend on the updated events state here
      console.log("calendar events saving");
      console.log("userId: ", user._id);
      console.table(eventsToSave);
  
      const updatedCalendarData = { userId: user._id, events: eventsToSave };
  
      updateCalendarByUserId(user._id, updatedCalendarData)
        .catch(error => console.error('Error saving calendar:', error));
    } else {
      // If events state is not initialized, set the flag to true
      console.log("events initialized");
      setEventsInitialized(true);
    }
  }, [eventsInitialized, user._id, events]);
  

    const onBeforeCreateEvent = useCallback((eventData) => {
        console.log("createEvent:" + eventData);

        const event = {
          calendarId: eventData.calendarId,
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
        setEventId("");
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
            setSelectedDate(props.date.toLocaleDateString());

            console.log("setCalendarVisibility")
            cal.current.getInstance().setCalendarVisibility('personal', true);
            cal.current.getInstance().setCalendarVisibility('organization', true);
            cal.current.getInstance().setCalendarVisibility('available', false);
            setPersonalEnabled(true);
            setOrganizationEnabled(true);
            setAvailableEnabled(false);

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
        const enabledCount = [personalEnabled, organizationEnabled, availableEnabled].filter(Boolean).length;
    
        if (toggleValue === true || enabledCount > 1) {
            switch (toggleName) {
                case 'personal':
                    cal.current.getInstance().setCalendarVisibility('personal', toggleValue);
                    setPersonalEnabled(toggleValue);
                    break;
                case 'organization':
                    cal.current.getInstance().setCalendarVisibility('organization', toggleValue);
                    setOrganizationEnabled(toggleValue);
                    break;
                case 'available':
                    cal.current.getInstance().setCalendarVisibility('available', toggleValue);
                    setAvailableEnabled(toggleValue);
                    break
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
    
        if (organizationEnabled) {
            updatedCalendars.push({
                id: 'organization',
                name: 'Organization',
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
    }, [personalEnabled, organizationEnabled, availableEnabled, user._id]);
    
    /*
    React Variables exported to Calendar
    const [dayView, setShowDay] = useState(false);
    const handleCloseDay = () => setShowDay(false);
    const handleShowDay = () => setShowDay(true); 
    */
    return (
        <Modal show={props.dayView} onHide={props.handleCloseDay} dialogClassName="dayview-modal" size="lg" centered>
            <Modal.Header closeButton className="bg-light">
                <h2>{new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h2>
            </Modal.Header>

            <Modal.Body>
                <Container>
                    <Row>
                        <Col sm={2} className="mt-3 text-center bg-light">
                            <h4>Filters</h4>
                            <Form className="text-left text-center">
                                <Form.Check
                                    type="switch"
                                    id="personal-switch"
                                    label="Personal"
                                    checked={personalEnabled}
                                    onChange={(e) => handleToggle('personal', e.target.checked)}
                                />
                                <Form.Check
                                    type="switch"
                                    id="organization-switch"
                                    label="Organization"
                                    checked={organizationEnabled}
                                    onChange={(e) => handleToggle('organization', e.target.checked)}
                                />
                                <Form.Check
                                    type="switch"
                                    id="available-switch"
                                    label="Available"
                                    checked={availableEnabled}
                                    onChange={(e) => handleToggle('available', e.target.checked)}
                                    disabled={!personalEnabled && !organizationEnabled && !availableEnabled}
                                />
                            </Form>

                            <h4>Options</h4>
                            <Button variant="outline-dark" onClick={handleSwitchView}>
                                Switch View
                            </Button>
                        </Col>

                        <Col sm={7} className="text-left">
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
                        <Col sm={3} className="bg-light">
                            <Form>
                                <Form.Group>
                                    <Form.Label><h4>Title</h4></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><h4>Calendar</h4></Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={calendarId}
                                        onChange={(e) => setCalendarId(e.target.value)}
                                        name="calendarId"
                                        required
                                    >
                                        <option value="personal">Personal</option>
                                        <option value="organization">Organization</option>
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
                                    <Form.Label><h4>Body</h4></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Enter body"
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><h4>Event ID</h4></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Event ID"
                                        value={eventId}
                                        disabled // Disable editing for this field
                                    />
                                </Form.Group>
                            </Form>
                            <Row className="mt-3">
                                <ButtonGroup>
                                    {title && calendarId && body && (!selectedEvent || !selectedEvent.id) &&  (
                                    <Button variant="outline-dark" onClick={handleCreateEvent}>
                                        Add Event
                                    </Button>
                                    )}
                                    
                                </ButtonGroup>
                                <ButtonGroup>
                                {selectedEvent && selectedEvent.id && title && calendarId && body && (
                                    <Button variant="outline-dark" onClick={handleUpdateEvent}>
                                        Update Event
                                    </Button>
                                    )}
                                    {selectedEvent && selectedEvent.id && title && calendarId && body && (
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
                
            </Modal.Footer>
        </Modal>
    ); 
};

export default DayViewModal