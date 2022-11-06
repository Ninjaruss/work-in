var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')

const User = require('../models/user.model')
mongoose.connect('mongodb://localhost:27017/Work-in')

/* GET users listing. */
router.get('/', function(req, res, next) {
  const userTable = [
    {
      id: 1, 
      username: "ninjaruss",
      hoursWorked: 200,
      basePay: 17.50
    }, 
    {
      id: 2,
      username: "L bozo",
      hoursWorked: 300,
      basePay: 17.50
    }
  ]

  res.json(userTable)
});


router.post('/register', async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.json({status: 'ok'});
  } catch (err){
    console.log(err);
    res.json({status: 'error', error: 'Duplicate email'});
  }

  res.json({status: 'ok'});
})


module.exports = router;
