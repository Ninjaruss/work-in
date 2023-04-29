const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, 'Please add a first name'],
    },
    last_name: {
      type: String,
      required: [true, 'Please add a last name'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },

    // either/or used for login => unique 
    email: {
      type: String,
      required: [false, 'Please add an email'],
      unique: true,
    },
    phone: {
      type: String,
      required: [false, 'Please add a phone number'],
      unique: true,
    },
    
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Organization'
    },
    calendar: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Calendar'
    },
    role: {
      type: String,
      required: false
    },
    permission: {
      type: String,
      required: false
    },
    verified: {
      type: Boolean,
      required: false
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)