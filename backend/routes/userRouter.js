var express = require('express');
var router = express.Router();
const { registerUser, loginUser, getMe, sendEmailVerification, verifyEmail } = require('../controllers/userController')
const { protect } = require('../middleware/authToken')

router.post('/', registerUser)
router.post('/login', loginUser)
// router.post('/confirm/:id', confirmEmail)
router.get('/me', protect, getMe)
router.post('/sendEmailVerification', sendEmailVerification)
router.post('/verifyEmail', verifyEmail)

module.exports = router;
