const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer');

const User = require('../models/userModel')

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
  const { first_name, last_name, email, phone, password } = req.body

  // require first/last name and password
  if (!first_name || !last_name || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // require either email or phone
  if (!email && !phone) {
    res.status(400)
    throw new Error('Please add either email or phone')
  }

  // Check if user exists through either email or phone
  const userExists_email = await User.findOne({ email })
  const userExists_phone = await User.findOne({ phone })

  if (userExists_email || userExists_phone) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user with verification token and verified set to false
  const user = await User.create({
    first_name,
    last_name,
    email,
    phone,
    password: hashedPassword,
    verified: false,
  })

  if (user) {
    // Generate email verification token
    const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d', // set token expiration time as desired
    })

    // Send verification email to user with verification token
    // You can implement the email sending logic here, using a third-party library or service
    // Example: sendVerificationEmail(email, verificationToken)
    // Make sure to handle any errors that may occur during email sending

    // Assuming sendVerificationEmail is a function that sends the verification email
    await sendEmailVerification(email, verificationToken);

    res.status(201).json({
      _id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      verified: user.verified,
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

const sendEmailVerification = async (email, verificationToken) => {
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

    // Compose the email
    const mailOptions = {
      from: process.env.SENDINBLUE_SMTP_USER, // Sender email address
      to: email, // Recipient email address
      subject: 'Email Verification', // Email subject
      text: 'Please click the link to verify your email address:', // Email body
      html: `<p>Please click the link to verify your email address: <a href="${process.env.APP_URL}/verify-email?token=${verificationToken}">Verify Email</a></p>`, // Email body with HTML
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log('Verification email sent successfully!');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

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

    if (!user.verified) {
      res.status(401);
      throw new Error('Email not verified. Please verify your email.');
    }

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
    res.status(400);
    return res.json({ error: 'Invalid token' }); // return the error response
  }

  try {
    // Verify email verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      res.status(404);
      return res.json({ error: 'User not found' }); // return the error response
    }

    if (user.verified) {
      res.status(400);
      return res.json({ error: 'Email already verified' }); // return the error response
    }

    user.verified = true;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    // Handle any other errors that may occur during verification
    res.status(500);
    return res.json({ error: 'Failed to verify email' }); // return the error response
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
  registerUser, loginUser, getMe, verifyEmail, sendEmailVerification, generateToken
}