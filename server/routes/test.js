const express = require('express');
const { User } = require('../database/schemas');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const { async } = require('regenerator-runtime');
const axios = require('axios');
const path = require('path');
const rp = require('request-promise');

const router   = express.Router();

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	// Optionally, send the error to an error tracking service
  });

async function generatePreImages(req, prompts) {
	const tokenPath = `${req.user._id}/${req.body.token_id}`;
	for (const prompt of prompts) {
		console.log(prompt);
	  const data = {
		token_id: req.body.token_id,
		prompt: prompt,
		negative_prompt: "negative",
		height: "512",
		width: "512",
		num_inference_steps: "28",
		guidance_scale: "7",
		num_images_per_prompt: "1",
		tokenPath : tokenPath,
	  }
	  try {
		const res = await rp.post('http://localhost:3000/api/v1/PostInference', { json: data });
		console.log(res);
	  } catch (error) {
		console.error(error);
	  }
	}
	return "success";
  }



router.post('/PostTest', (req, res) => {

	const prompts = req.body.prompts;

	// generatePreImages(req, prompts)


});

module.exports = router;