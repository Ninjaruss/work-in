var express = require('express');
var router = express.Router();
const { newCalendar, getCalendar, deleteCalendar, updateCalendar, getCalendarByUserId } = require('../controllers/calendarController')
const { protect } = require('../middleware/authToken')

router.post('/:id', newCalendar)
router.get('/:id', getCalendar)
router.put('/:id', updateCalendar)
router.delete('/:id', deleteCalendar)
router.get('/user/:userId', getCalendarByUserId )


module.exports = router;
