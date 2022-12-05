var express = require('express');
var router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/userController')
const { protect } = require('../middleware/authToken')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)

module.exports = router;
