var express = require('express');
var router = express.Router();
const {getUser, setUser, putUser, deleteUser} = require('../controllers/usersController')

// router.get('/', getUser)
router.route('/').get(getUser).post(setUser)
router.route('/:uid').put(putUser).delete(deleteUser)

module.exports = router;
