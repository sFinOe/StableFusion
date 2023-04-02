const express = require('express');
const { User } = require('../database/schemas');
const multer = require('multer');
const archiver = require("archiver");
const bodyParser = require('body-parser');
const AWS = require("aws-sdk");
const fs = require('fs');
const dotenv = require('dotenv');
const crypto = require('crypto');


const router   = express.Router();

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	// Optionally, send the error to an error tracking service
  });


router.post('/PostPrompts', (req, res) => {
    const user_id = req.user._id;
    const token_id = req.body.token_id;
    const Normalprompts = req.body.prompts;
    const Professions_prompts = req.body.professions_prompts;

    const prompts = Normalprompts.concat(Professions_prompts);

	User.findOneAndUpdate({ "studio.token_id": token_id }, { $set: { "studio.$.prompts": prompts } }, { new: true })
		.then((user) => {
			if (!user) {
				res.status(404).send();
			}
			res.send(user.studio);
		}
		).catch((e) => {
			res.status(400).send();
		});
});

module.exports = router;