var express = require('express');
var router = express.Router();
const { registerUser, registerAll, loginUser, getMe, resendEmailVerification, verifyEmail } = require('../controllers/userController')
const { protect } = require('../middleware/authToken')

router.post('/', registerUser)
router.post('/registerAll', registerAll)
router.post('/login', loginUser)
// router.post('/confirm/:id', confirmEmail)
router.get('/me', protect, getMe)
router.post('/resendEmailVerification', resendEmailVerification)
router.post('/verifyEmail', verifyEmail)

module.exports = router;
