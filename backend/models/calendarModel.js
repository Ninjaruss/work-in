const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  calendarId: {
    type: String,
  },
  category: {
    type: String,
  },
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  /*
  isAllDay: {
    type: Boolean,
  },
  */
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
      required: false,
      ref: 'Organization'
    },
    events: [eventSchema]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Calendar', calendarSchema);