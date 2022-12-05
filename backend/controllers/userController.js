const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')

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
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
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
      token: generateToken(user._id),
      })
  } else {
      res.status(400)
      throw new Error('Invalid credentials')
  }
})

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
  registerUser, loginUser, getMe
}