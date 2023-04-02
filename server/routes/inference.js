const express = require('express');
const { User } = require('../database/schemas');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const { async } = require('regenerator-runtime');
const axios = require('axios');
const path = require('path');

const router   = express.Router();

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	// Optionally, send the error to an error tracking service
  });


async function downloadImages(imageUrls) {
	const base64Images = [];
	for (const imageUrl of imageUrls) {
	  const base64 = await new Promise((resolve, reject) => {
		https.get(imageUrl, response => {
		  let data = '';
		  response.setEncoding('binary');
		  response.on('data', chunk => {
			data += chunk;
		  });
		  response.on('end', () => {
			const base64 = Buffer.from(data, 'binary').toString('base64');
			resolve(base64);
		  });
		  response.on('error', error => {
			reject(error);
		  });
		});
	  });
	  base64Images.push(base64);
	}
	return base64Images;
  }

async function CreateDir(token_path) {

	const dir = `storage/gallery/${token_path}`;
	if (!fs.existsSync(dir)){
	  fs.mkdirSync(dir, { recursive: true });
	}
	  
}
  

router.post('/PostInference', (req, res) => {

	let token_path = "";
	
	if (req.body.tokenPath != "")
		token_path = req.body.tokenPath;
	else
		token_path = `${req.user._id}/${req.body.token_id}`;
	const token_id = req.body.token_id;
	const prompt = req.body.prompt;
	const negative_prompt = req.body.negative_prompt;
	const height = req.body.height;
	const width = req.body.width;
	const num_inference_steps = req.body.num_inference_steps;
	const guidance_scale = req.body.guidance_scale;
	const num_images_per_prompt = req.body.num_images_per_prompt;
	const doneInference = req.body.doneInference;
	const model_path = `${process.env.SAVE_MODEL}/${token_path}`;
	const bucket_name = process.env.GALLERY_BUCKET;

	async function saveImages(base64Images, token_path) {
		const filePaths = [];
		await CreateDir(token_path);
		for (const [index, base64] of base64Images.entries()) {
		  const fileName = `${Date.now()}.jpeg`;
		  const filePath = `storage/gallery/${token_path}/${fileName}`;
		  await new Promise((resolve, reject) => {
			fs.writeFile(filePath, base64, 'base64', error => {
			  if (error) {
				reject(error);
			  } else {
				filePaths.push(filePath);
				resolve();
			  }
			});
		  });
		}
		return filePaths;
	  }

	const payload = {
		input: {
		  prompt: prompt,
		  negative_prompt: negative_prompt,
		  height: height,
		  width: width,
		  num_inference_steps: num_inference_steps,
		  guidance_scale: guidance_scale,
		  num_images_per_prompt: num_images_per_prompt,
		  model_path : model_path,
		  bucket_name : bucket_name,
		  token_path : token_path,
		  restore_faces : "true",
		},
		s3Config: {
		  accessId: `${process.env.ACCESS_KEY_ID}`,
		  accessSecret: `${process.env.SECRET_ACCESS_KEY}`,
		  endpointUrl: `${process.env.ENDPOINT}`,
		},
	  };

	const header = {
		headers: {
		  "Content-Type": "application/json",
		  Authorization: `Bearer ${process.env.RUNPOD_API}`,
		},
	};

	const inputData = {};

	let id;

	axios.post(`${process.env.RUNPOD_ENDPOINT}`, payload, header)
  .then(
    (response) => {
      id = response.data.id;
    },
    (error) => {
      console.log(error);
    }
  ).then(() => {
    async function checkStatus() {
      axios.post(`${process.env.RUNPOD_STATUS}/${id}`, inputData, header).then(
        (response) => {
          if (response.data.status == "COMPLETED") {
			downloadImages(response.data.output.output).then((images) => {
				saveImages(images, token_path).then((filePaths) => {
					// console.log("Done saving images");
					if (doneInference){
						User.findOneAndUpdate({ "studio.token_id": token_id }, { $set: { "studio.$.inference": true } }, { new: true })
						.then((user) => {
							// console.log("Done updating user");
							let NewPath = filePaths[0].replace("storage", "/images");
							return res.status(200).json(NewPath);
						}).catch((err) => {
							console.log(err);
						});
						}
						else{
							let NewPath = filePaths[0].replace("storage", "/images");
							return res.status(200).json(NewPath);
						}
				});
			});
          } else {
            setTimeout(checkStatus, 1000);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
    	checkStatus();
  });
});


module.exports = router;