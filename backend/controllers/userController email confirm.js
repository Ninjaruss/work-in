const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer');

const User = require('../models/userModel')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'officialworkin.service@gmail.com',
    pass: 'Workin2023'
  }
});

/*
 TODO: Check if user exists already 
 (duplicates: can have 1 user using email and 1 using phone pointing to same person)
*/
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

  // Create user
  const user = await User.create({
    first_name,
    last_name,
    email,
    phone,
    password: hashedPassword,
  });

  if (user) {
    // Send confirmation email
    const confirmationLink = `https://work-in.net/confirm/${user._id}`; // Example confirmation link
    const mailOptions = {
      from: 'your_email@example.com', // Sender email address
      to: user.email, // Recipient email address
      subject: 'Confirm Your Account', // Email subject
      html: `Thank you for registering. Please click the following link to confirm your account: <a href="${confirmationLink}">${confirmationLink}</a>`, // Email content
    };
    await transporter.sendMail(mailOptions); // Send email

    res.status(201).json({
      _id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ error: 'Invalid user data' });
  }
})

// @desc Authenticate a user using phone/email as login w/ password
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body
  let user

  if (email) {
    user = await User.findOne({ email })
  } else if (phone){
    user = await User.findOne({ phone })
  } else {
    res.status(400)
    throw new Error('User could not be found')
  }

  if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
      _id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,

      organization: user.organization,
      calendar: user.calendar,
      role: user.role,
      permission: user.permission,

      token: generateToken(user._id),
      })
  } else {
      res.status(400)
      throw new Error('Invalid credentials')
  }
})

// Confirmation link endpoint
// @desc Confirm user's email
// @route GET /api/users/confirm/:token
// @access Public
const confirmEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    const user = await User.findById(decoded.id);

    if (user) {
      // Update user's email confirmed status
      user.isEmailConfirmed = true;
      await user.save();

      res.status(200).json({
        message: 'Email confirmed successfully',
      });} else {
        res.status(404);
        throw new Error('User not found');
      }
    } catch (error) {
      res.status(400);
      throw new Error('Invalid token');
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
  registerUser, loginUser, getMe, confirmEmail
}