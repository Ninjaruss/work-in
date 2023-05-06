const mongoose = require('mongoose')

import userSchema from "./userModel";

const organizationSchema = mongoose.Schema(
  {
    org_name: {
        type: String,
        required: true
    },
    calendar: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Calendar'
    },
    employees: [userSchema],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Organization', organizationSchema)