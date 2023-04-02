const express = require('express');
const { User } = require('../database/schemas');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const { async } = require('regenerator-runtime');
const axios = require('axios');
const path = require('path');
const sharp = require('sharp');
const rp = require('request-promise');

const router   = express.Router();

router.get('/verify/:EmailToken', async (req, res) => {
	const EmailToken = req.params.EmailToken;
  
	try {
	  const user = await User.findOneAndUpdate(
		{ email_verification_token: EmailToken },
		{ email_verified: true, email_verification_token: null},
		{ new: true }
	  );
	  if (!user) {
		return res.status(400).send({ message: 'Email verification failed' });
	  }
	  res.redirect('/login'); // Redirect user to login page
	} catch (err) {
	  console.log(err);
	  res.status(400).send({ message: 'Email verification failed', err });
	}
  });

module.exports = router;