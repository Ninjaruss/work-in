const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

const { protect } = require('../middleware/authToken')

// Create a new calendar
router.post('/', calendarController.newCalendar);

// Get a calendar by ID
router.get('/:id', calendarController.getCalendar);

// Update a calendar by ID
router.put('/:id', calendarController.updateCalendar);

// Delete a calendar by ID
router.delete('/:id', calendarController.deleteCalendar);

// Get a calendar by user ID
router.get('/user/:userId', calendarController.getCalendarByUserId);

// Update a calendar by user ID
router.put('/user/:userId', calendarController.updateCalendarByUserId);

// Update a calendar by organization ID
router.put('/organization/:organizationId', calendarController.updateCalendarByOrganizationId);

// Delete a calendar by user ID
router.delete('/user/:userId', calendarController.deleteCalendarByUserId);

module.exports = router;