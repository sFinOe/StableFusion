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

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	// Optionally, send the error to an error tracking service
  });

function getImagePaths(directoryPath, paths = []) {
	const files = fs.readdirSync(directoryPath);
  
	files.forEach((file) => {
	  const filePath = path.join(directoryPath, file);
  
	  if (fs.statSync(filePath).isDirectory()) {
		getImagePaths(filePath, paths);
	  } else {
		const extname = path.extname(filePath);
		if (extname === '.jpg' || extname === '.jpeg' || extname === '.png' || extname === '.gif') {
			let newPath = filePath.replace('storage', '/images');
		  paths.push(newPath);
		}
	  }
	});
  
	return paths;
  }

router.post('/GetSelfies', async (req, res) => {
	
	const directoryPath = `storage/selfies/${req.user._id}`;

	let responseSent = false; // Add variable to track if response has been sent
	let images = [];
	let count = 0;

	try {

		let paths = getImagePaths(directoryPath);
		res.send(paths);
	}
	catch (err) {
		res.send([]);
	}

});

module.exports = router;