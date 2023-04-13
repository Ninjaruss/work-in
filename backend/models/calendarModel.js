const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  isAllDay: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    default: 'time'
  },
  calendarId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Calendar'
  }
});

const calendarSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Organization'
    },
    events: [eventSchema]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Calendar', calendarSchema);