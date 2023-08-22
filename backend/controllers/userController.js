const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/userModel')
const Organization = require('../models/organizationModel')
const Calendar = require('../models/calendarModel')

const DAYS_OF_WEEK = {
  Sunday: 'Sun',
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
};

const DAY_NAME_TO_NUMBER = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const generateRandomPassword = () => {
  const length = 8;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
};

/*
 TODO: Check if user exists already 
 (duplicates: can have 1 user using email and 1 using phone pointing to same person)
*/
// @desc Register new user
// @route POST /api/users/register
// @access Public
// @desc Register new user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, phone, password, organization } = req.body || {};

  // require first/last name
  if (!first_name || !last_name) {
    res.status(400);
    throw new Error('Please provide both first name and last name');
  }

  // Generate a random password if not provided
  const generatedPassword = password || generateRandomPassword();

  // require either email or phone
  if (!email) {
    res.status(400);
    throw new Error('Please provide either email or phone');
  }

  // Check if user exists through either email or phone
  console.log('--^--');
  console.log(first_name);
  console.log(last_name);
  console.log(email);
  console.log(password);
  console.log(organization);

  const userExists_email = await User.findOne({ email });
  // const userExists_phone = await User.findOne({ phone });

  if (userExists_email) {
    console.log('5');
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(generatedPassword, salt);

  // Create user with verification token and verified set to false
  const user = await User.create({
    first_name,
    last_name,
    email,
    phone: '',
    password: hashedPassword,
    verified: false,
    organization,
  });

  if (user) {
    // Generate email verification token
    const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d', // set token expiration time as desired
    });

    // Send verification email to user with verification token and generated password
    await sendEmailVerification(email, verificationToken, password ? undefined : generatedPassword);

    // If `res` is available (called from `registerAll`), send the response directly
    if (res) {
      res.status(201).json({
        _id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        verified: user.verified,
        organization: user.organization,
      });
    } else {
      // If `res` is not available (called independently), return the user object
      return {
        _id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        verified: user.verified,
        organization: user.organization,
      };
    }
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }

  // Update the owner's organization if it's available
  if (organization && user._id) {
    await User.updateOne(
      { _id: user._id },
      { $set: { organization: organization } }
    );
  }
});

const registerAll = async (req, res) => {
  try {
    const { user, orgName, orgType, employees, employeeSchedules } = req.body;

    // Create the owner's calendar
    const organizationCalendar = await Calendar.create({ userId: user._id, events: [] });

    // Create the organization
    const organization = await Organization.create({ org_name: orgName, org_type: orgType, calendar: organizationCalendar._id });

    // Update organizationCalendar with organizationId
    organizationCalendar.organizationId = organization._id;
    await organizationCalendar.save();

    // Loop through employees and register them
    for (let i = 0; i < employees.length; i++) {
      const employee = employees[i];
      const basicSchedule = employeeSchedules[i];
      const { first_name, last_name, email, phone } = employee;

      // Create user
      const registerUserReq = {
        body: {
          first_name,
          last_name,
          email,
          phone,
          password: null, // Password will be generated automatically
          organization: organization._id, // Assign the organization to the user
        },
        res: res,
      };

      // Call registerUser function
      const newUser = await registerUser(registerUserReq);

      // Obtain user's _id from the returned newUser object
      const userId = newUser._id;

      /*
      // Generate a unique identifier for the user's calendar
      const calendarId = `calendar_${userId}`
      */

      // Create an array to store the events
      const events = [];

      console.log("-0-") 
      // Calculate the start date for generating the schedule
      const startDate = new Date();

      // Create a Set to store unique event identifiers
      const uniqueEvents = new Set();

      // Iterate over the next 4 weeks
      for (let week = 0; week < 4; week++) {
        // Iterate over the days in the basic schedule object
        for (const day in basicSchedule) {
          if (basicSchedule.hasOwnProperty(day) && basicSchedule[day] && basicSchedule[day].startTime && basicSchedule[day].endTime) {
            const { startTime, endTime } = basicSchedule[day];

            // Get the current day of the week
            const currentDayNumber = DAY_NAME_TO_NUMBER[day];

            // Calculate the date for the current day of the week in the current week
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + (7 * week) + currentDayNumber - startDate.getDay());

            // Parse start time and end time
            const [startHours, startMinutes] = startTime.split(':');
            const [endHours, endMinutes] = endTime.split(':');

            // Create Date objects for start and end times on the current day
            const startDateTime = new Date(currentDate);
            startDateTime.setHours(Number(startHours), Number(startMinutes));

            const endDateTime = new Date(currentDate);
            endDateTime.setHours(Number(endHours), Number(endMinutes));

            // If the end time is before the start time, adjust the endDateTime to the next day
            if (Number(endHours) < Number(startHours) || (Number(endHours) === Number(startHours) && Number(endMinutes) < Number(startMinutes))) {
              endDateTime.setDate(endDateTime.getDate() + 1);
            }

            // Generate a unique identifier for this event based on date and time
            const eventIdentifier = `${startDateTime.toISOString()}-${endDateTime.toISOString()}`;

            // Check if this event has already been created for this employee
            if (!uniqueEvents.has(eventIdentifier)) {
              // Add the event identifier to the set to prevent duplicates
              uniqueEvents.add(eventIdentifier);

              // Create an event object using the schedule information
              const event = {
                id: String(uuidv4()),
                calendarId: 'personal',
                category: 'time',
                title: 'Work Schedule for [' + newUser.first_name + ' ' + newUser.last_name + ']',
                body: 'Event generated by [' + user.first_name + ' ' + user.last_name + ']' + ' for ' + newUser.first_name + ' ' + newUser.last_name + ']',
                start: startDateTime.toISOString(),
                end: endDateTime.toISOString(),
                isAllDay: false,
              };

              // Add the event object to the events array
              events.push(event);
            } else {
              console.error('Duplicate event skipped:', eventUUID);
            }
          }
        }

        
      }

      console.log("1---EVENTS---1")
      console.table(events)
      console.log("2---EVENTS---2")

      try {
        // Attempt to insert the events
        const userCalendar = await Calendar.create({ userId, events });

        // Update the userCalendar's organizationId
        userCalendar.organizationId = organization._id;

        // Save the calendar object in the database
        await userCalendar.save();
      } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern['events.id'] === 1) {
          // Handle the duplicate key error here
          console.error('Duplicate key error. Event with the same ID already exists.');
        } else {
          // Handle other errors
          console.error('Error inserting event:', error);
        }
      }
    }

    // Update the owner's organization if it's available
    if (organization && user._id) {
      await User.updateOne(
        { _id: user._id },
        { $set: { organization: organization._id } }
      );
    }

    // Return the updated user
    const updatedUser = await User.findById(user._id);

    res.status(200).json({ message: 'Users registered and calendars saved successfully!' , user: updatedUser});
  } catch (error) {
    console.error('Error registering users and saving calendars:', error);
    res.status(500).json({ error: 'An error occurred while registering users and saving calendars' });
  }
};

const sendEmailVerification = asyncHandler(async (email, verificationToken, generatedPassword) => {
  try {
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      // Specify SMTP settings using environment variables
      host: process.env.SENDINBLUE_SMTP_HOST, // SMTP host
      port: process.env.SENDINBLUE_SMTP_PORT, // SMTP port
      secure: process.env.SENDINBLUE_SMTP_SECURE === 'true', // set TLS
      auth: {
        user: process.env.SENDINBLUE_SMTP_USER, // SMTP username (SMTP key)
        pass: process.env.SENDINBLUE_SMTP_PASSWORD, // SMTP password (not required for Sendinblue)
      },
    });

    // Compose the email body
    /*
    let emailBody = 'Please click the link to verify your email address:';
    if (generatedPassword) {
      emailBody += `\nYour temporary password is: ${generatedPassword}`;
    }
    */

    // Compose the email
    const mailOptions = {
      from: process.env.SENDINBLUE_SMTP_USER, // Sender email address
      to: email, // Recipient email address
      subject: 'Email Verification', // Email subject
      // text: emailBody, // Email body
      html: `
      <p>
      Here are your login details:
      <br> User Log-in: ${email}
      <br> ${generatedPassword ? `Temporary Password: ${generatedPassword}` : 'Please use your own password'}
      <br> Step 1). Click the following link to access the <a href="https://work-in.net">Work-In Website</a>
      <br> Step 2). Log in with the user login and password provided in this email
      <br> Step 3). Click the following link to verify your email while you are logged in <a href="${process.env.APP_URL}/verify-email?token=${verificationToken}">Verify Email</a>
      <br> Step 4). Welcome to Work-In! You can now access your work schedule through the internet 
      </p>`, // Email body with HTML
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log('Verification email sent successfully!');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
});

// @desc Authenticate a user using phone/email as login w/ password
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;

  if (!email && !phone) {
    res.status(400);
    throw new Error('Please provide either email or phone');
  }

  try {
    let user = null;

    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({ phone });
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401);
      throw new Error('Invalid email/phone or password');
    }

    /*
      if (!user.verified) {
        res.status(401);
        throw new Error('Email not verified. Please verify your email.');
      }
    */

    // Generate authentication token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d', // set token expiration time as desired
    });

    res.json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      verified: user.verified,
      organization: user.organization,
      token,
    });
  } catch (error) {
    // Handle the error and send appropriate response
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});


// @desc Verify user email
// @route POST /api/users/verify-email
// @access Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ error: 'Invalid token' });
    return;
  }

  try {
    // Verify email verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded: ", decoded)
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.verified) {
      res.status(400).json({ error: 'Email already verified' });
      return;
    }

    user.verified = true;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' }, user);
  } catch (error) {
    // Handle any other errors that may occur during verification
    res.status(500).json({ error: 'Failed to verify email' });
  }
});

// @desc Get logged in user
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
  })
}

module.exports = {
  registerUser, registerAll, loginUser, getMe, verifyEmail, sendEmailVerification, generateToken
}