const express = require('express');
const { User } = require('../database/schemas');

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