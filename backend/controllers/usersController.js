const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')

// @desc Get user
// @route GET /api/user
// @access private
const getUser = asyncHandler(async (req, res) => {
    const users = await User.find()
    res.status(200).json(users)
})

// @desc Set user
// @route POST /api/user
// @access private
const setUser = asyncHandler(async (req, res) => {
    if (!req.body.text){
        res.status(400)
        throw new Error('Please add a text field')
    }
    
    res.status(200).json({message: `Set user`})
})

// @desc Update user
// @route PUT /api/user
// @access private
const putUser = asyncHandler(async (req, res) => {
    res.status(200).json({message: `Update user ${req.params.uid}`})
})

// @desc Delete user
// @route DELETE /api/user
// @access private
const deleteUser = asyncHandler(async (req, res) => {
    res.status(200).json({message: `Delete user ${req.params.uid}`})
})

module.exports = {
    getUser, setUser, putUser, deleteUser
}