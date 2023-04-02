const express = require('express');
const { User } = require('../database/schemas');
const multer = require('multer');
const archiver = require("archiver");
const bodyParser = require('body-parser');
const AWS = require("aws-sdk");
const fs = require('fs');
const dotenv = require('dotenv');
const crypto = require('crypto');

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	// Optionally, send the error to an error tracking service
  });

dotenv.config();

AWS.config.update({
	accessKeyId: `${process.env.ACCESS_KEY_ID}`,
	secretAccessKey: `${process.env.SECRET_ACCESS_KEY}`,
});

const s3 = new AWS.S3({
	endpoint: `${process.env.ENDPOINT}`,
	s3ForcePathStyle: true,
	signatureVersion: "v4",
	region: `${process.env.REGION}`,
});


const router   = express.Router();

let BPathImages = [];

const storage = multer.diskStorage({
	
	destination: function (req, file, cb) {
	const dir = `storage/selfies/${req.user._id}`;
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}
	  cb(null, dir);
	},
	filename: function (req, file, cb) {
		let path = `${crypto.randomBytes(4).toString('hex')}-${new Date().getTime()}.${file.mimetype.split('/')[1]}`;
		BPathImages.push(`storage/selfies/${req.user._id}/${path}`);
	  cb(null, path);
	}
	
  });

const upload = multer({ storage: storage });

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/upload', upload.array('images'), (req, res) => {
	const token_id = `${new Date().getTime()}`;
	const client_id = req.user._id;
	const files = req.files;
  
	// Create an empty array to store the image paths
	const PathImages = [];
  
	// Set up archiver and S3 upload parameters
	const zipFileName = `${token_id}.zip`;
	const archive = archiver('zip', { zlib: { level: 9 } });
	const s3UploadParams = {
	  Bucket: `${process.env.DATASET_BUCKET}`,
	  Key: `${client_id}/${zipFileName}`,
	  Body: archive,
	  ContentType: 'application/zip',
	};
  
	archive.on('warning', (err) => {
	  if (err.code === 'ENOENT') {
		console.warn(err);
	  } else {
		throw err;
	  }
	});
  
	archive.on('error', (err) => {
	  throw err;
	});
  
	const uploadZipToS3 = () => {
	  s3.upload(s3UploadParams, (err, data) => {
		if (err) {
		  return res.status(500).send(err);
		}
  
		// If upload is successful, send the array of image paths back in the response
		return res.status(200).send({
		  token_id: token_id,
		  images: PathImages,
		});
	  });
	};
  
	files.forEach((file) => {
	  // For each file, add its path to the PathImages array
	  PathImages.push(`storage/selfies/${req.user._id}/${file.filename}`);
	  archive.file(file.path, { name: file.filename });
	});
  
	archive.finalize();
	uploadZipToS3();
  });

module.exports = router;