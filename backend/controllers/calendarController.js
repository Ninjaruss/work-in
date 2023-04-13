const Calendar = require('../models/calendarModel')

// Create a new calendar
const newCalendar = async (req, res) => {
  try {
    const calendar = new Calendar(req.body);
    await calendar.save();
    res.status(201).send(calendar);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Get a calendar by id
const getCalendar = async (req, res) => {
  try {
    const calendar = await Calendar.findById(req.params.id);
    if (!calendar) {
      return res.status(404).send({ error: 'Calendar not found' });
    }
    res.send(calendar);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Update a calendar
const updateCalendar = async (req, res) => {
  try {
    const calendar = await Calendar.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!calendar) {
      return res.status(404).send({ error: 'Calendar not found' });
    }
    res.send(calendar);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Delete a calendar
const deleteCalendar = async (req, res) => {
  try {
    const calendar = await Calendar.findByIdAndDelete(req.params.id);
    if (!calendar) {
      return res.status(404).send({ error: 'Calendar not found' });
    }
    res.send(calendar);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getCalendarByUserId = async (req, res) => {
    try {
      const userId = req.params.userId;
      const calendar = await Calendar.findOne({ user: userId }).populate('events');
      if (!calendar) {
        return res.status(404).json({ message: 'Calendar not found' });
      }
      res.status(200).json(calendar);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
  newCalendar, getCalendar, updateCalendar, deleteCalendar, getCalendarByUserId
}