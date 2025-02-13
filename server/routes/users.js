const express = require('express');
const { User } = require('../database/schemas');

const router   = express.Router();

module.exports = router;

router.post('/checkusername', (req, res) => {
  const username = req.body.username.toLowerCase();

  User.find({ username }, (err, users) => {
    if (err) {
      res.status(400).send({ message: 'Check Email failed', err, username });
    }
    if (users && users[0]) {
      res.send({ available: false, message: 'Email exists', username });
    } else {
      res.send({ available: true, message: 'Email available', username });
    }
  });
});
