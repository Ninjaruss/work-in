const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler') // replaces try catch blocks
const Calendar = require('../models/calendarModel');

// Create a new calendar
const newCalendar = asyncHandler(async (req, res) => {
  const userId = req.body.userId; // Assuming userId is provided in the request body
  const existingCalendar = await Calendar.findOne({ userId }); // Check if a calendar with the given userId exists

  if (existingCalendar) {
    // If a calendar with the given userId already exists, send an error response
    return res.status(400).send({ error: 'Calendar already exists for the given user ID' });
  }

  // If no existing calendar found, create a new one
  const calendar = new Calendar(req.body);
  await calendar.save();

  res.status(201).send(calendar);
});

// Get a calendar by ID
const getCalendar = asyncHandler(async (req, res) => {
    const calendar = await Calendar.findById(req.params.id);
    if (!calendar) {
      return res.status(404).send({ error: 'Calendar not found' });
    }
    res.send(calendar);
});

// Update a calendar by ID
const updateCalendar = asyncHandler(async (req, res) => {
    const calendar = await Calendar.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!calendar) {
      return res.status(404).send({ error: 'Calendar not found' });
    }
    res.send(calendar);
});

// Delete a calendar by ID
const deleteCalendar = asyncHandler(async (req, res) => {
    const calendar = await Calendar.findByIdAndDelete(req.params.id);
    if (!calendar) {
      return res.status(404).send({ error: 'Calendar not found' });
    }
    res.send(calendar);
});

// Get a calendar by user ID
const getCalendarByUserId = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const calendar = await Calendar.findOne({ userId: userId }).populate('events');
    if (!calendar) {
      return res.status(404).json({ message: 'Calendar not found' });
    }
    res.status(200).json(calendar);
});

// Update the calendar by user ID
const updateCalendarByUserId = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const calendarData = req.body; // Updated calendar data from request body
  const updatedEvents = calendarData.events; // Extract events array from calendarData
  const calendar = await Calendar.findOne({ userId: userId });

  console.log("updatedEvents")
  console.table(updatedEvents)

  if (!calendar) {
    return res.status(404).send({ error: 'Calendar not found' });
  }

  const events = calendar.events;
  console.log("calendarEvents")
  console.table(events)

  // Loop through events array and remove events that are not present in updatedEvents array
  const eventsToRemove = events.filter(event => !updatedEvents.some(updatedEvent => updatedEvent.id === event.id));
  eventsToRemove.forEach(eventToRemove => {
    const eventIndex = events.findIndex(event => event.id === eventToRemove.id);
    if (eventIndex !== -1) {
      events.splice(eventIndex, 1); // Remove event from events array
    }
  });

  // Loop through updatedEvents array and update events in events array
  for (const updatedEvent of updatedEvents) {
    const existingEventIndex = events.findIndex(event => event.id === updatedEvent.id); // Find index of existing event

    if (existingEventIndex !== -1) {
      // If eventId exists in events array, update the existing event
      events[existingEventIndex] = updatedEvent; // Update the event at existingEventIndex with updatedEvent
    } else {
      // If eventId does not exist, append the updatedEvent to events array
      events.push(updatedEvent);
    }
  }

  const updatedCalendar = await calendar.save();
  res.send(updatedCalendar);
});

// Get calendars by organization ID
const getCalendarsByOrganizationId = asyncHandler(async (req, res) => {
  const organizationId = req.params.organizationId;
  const calendars = await Calendar.find({ organizationId: organizationId }).populate('events');

  console.log("getCalendarsByOrganizationId: ", organizationId)
  
  if (!calendars || calendars.length === 0) {
    return res.status(404).json({ message: 'Calendars not found for the organization' });
  }
  
  res.status(200).json(calendars);
});

// Update a calendar by organization ID
const updateCalendarByOrganizationId = asyncHandler(async (req, res) => {
  const organizationId = req.params.organizationId;
  const calendarData = req.body; // Updated calendar data from request body
  const updatedEvents = calendarData.events; // Extract events array from calendarData
  const calendar = await Calendar.findOne({ organizationId: organizationId });

  if (!calendar) {
    return res.status(404).send({ error: 'Calendar not found' });
  }

  const events = calendar.events;

  // Loop through events array and remove events that are not present in updatedEvents array
  const eventsToRemove = events.filter(event => !updatedEvents.some(updatedEvent => updatedEvent.id === event.id));
  eventsToRemove.forEach(eventToRemove => {
    const eventIndex = events.findIndex(event => event.id === eventToRemove.id);
    if (eventIndex !== -1) {
      events.splice(eventIndex, 1); // Remove event from events array
    }
  });

  // Loop through updatedEvents array and update events in events array
  for (const updatedEvent of updatedEvents) {
    const existingEventIndex = events.findIndex(event => event.id === updatedEvent.id); // Find index of existing event

    if (existingEventIndex !== -1) {
      // If eventId exists in events array, update the existing event
      events[existingEventIndex] = updatedEvent; // Update the event at existingEventIndex with updatedEvent
    } else {
      // If eventId does not exist, append the updatedEvent to events array
      events.push(updatedEvent);
    }
  }

  const updatedCalendar = await calendar.save();
  res.send(updatedCalendar);
});

// Delete a calendar by user ID
const deleteCalendarByUserId = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const calendar = await Calendar.findOneAndDelete({ userId: userId });
    if (!calendar) {
      return res.status(404).send({ error: 'Calendar not found' });
    }
    res.send(calendar);
});

module.exports = {
  newCalendar,
  getCalendar,
  updateCalendar,
  deleteCalendar,

  getCalendarByUserId,
  updateCalendarByUserId,

  getCalendarsByOrganizationId,
  updateCalendarByOrganizationId,

  deleteCalendarByUserId,
};
