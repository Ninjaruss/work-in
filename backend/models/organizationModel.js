const mongoose = require('mongoose');
const { Schema } = mongoose;

const organizationSchema = Schema(
  {
    org_name: {
      type: String,
      required: true
    },
    calendar: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Calendar'
    },
    employees: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    org_type: {
      type: String,
      required: false
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Organization', organizationSchema);