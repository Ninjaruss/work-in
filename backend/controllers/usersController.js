
// @desc Get user
// @route GET /api/user
// @access private
const getUser = (req, res) => {
    res.status(200).json({message: `Get user`})
}

// @desc Set user
// @route POST /api/user
// @access private
const setUser = (req, res, err) => {
    if (!req.body.text){
        res.status(400)
        throw new Error('Please add a text field')
    }
    res.status(200).json({message: `Set user`})
};

// @desc Update user
// @route PUT /api/user
// @access private
const putUser = (req, res) => {
    res.status(200).json({message: `Update user ${req.params.uid}`})
};

// @desc Delete user
// @route DELETE /api/user
// @access private
const deleteUser = (req, res) => {
    res.status(200).json({message: `Delete user ${req.params.uid}`})
};

module.exports = {
    getUser, setUser, putUser, deleteUser
}