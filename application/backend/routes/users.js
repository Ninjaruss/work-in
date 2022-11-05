var express = require('express');
var router = express.Router();

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

module.exports = router;
