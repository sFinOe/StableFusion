const express = require("express");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const rp = require("request-promise");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
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
      if (extname === ".jpg" || extname === ".jpeg" || extname === ".png" || extname === ".gif") {
        let newPath = filePath.replace("storage", "/images");
        paths.push(newPath);
      }
    }
  });

  return paths;
}

router.post("/GetGallery", (req, res) => {
  const user_id = req.user._id;
  const token_id = req.body.token_id;
  const GetAll = req.body.GetAll;
  const directoryPath = `storage/gallery/${user_id}`;

  let responseSent = false; // Add variable to track if response has been sent
  let images = [];
  let count = 0;

  if (GetAll) {
    try {
      let paths = getImagePaths(directoryPath);

      res.send(paths);
    } catch (err) {
      let paths = [];
      return res.send(paths);
    }
  } else {
    const ImagesDir = `storage/gallery/${user_id}/${token_id}`;

    fs.readdir(ImagesDir, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        const imageData = files.map((file) => {
          let filePath = path.join(ImagesDir, file);
          filePath = filePath.replace("storage", "/images");
          return filePath;
        });
        if (!responseSent) {
          // Check if response has already been sent
          responseSent = true;
          res.send(imageData);
        }
      }
    });
  }
});

router.post("/PostDeleteImage", (req, res) => {
  const ImagePath = req.body.ImagePath;
  let NewPath = ImagePath.replace("/images", "storage");

  fs.unlink(NewPath, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.send("success");
    }
  });
});

router.post("/GetLowerImage", async (req, res) => {
  const imagePath = req.body.ImagePath;
  let NewPath = imagePath.replace("/images", "storage");

  try {
    const imageBuffer = await sharp(NewPath).resize(512, 512).toBuffer();

    const base64Data = imageBuffer.toString("base64");
    const imageDataUrl = `data:image/png;base64,${base64Data}`;

    res.send(imageDataUrl);
  } catch (err) {
    console.error("Error resizing image:", err);
    res.status(500).send("Error resizing image");
  }
});

async function MakeMoreImages(prompts, user_id, token_id) {
  const tokenPath = `${user_id}/${token_id}`;
  const inferenceRequests = prompts.map(async (prompt, index) => {
    const data = {
      token_id: token_id,
      prompt: prompt,
      negative_prompt:
        "disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, disgusting, poorly drawn hands, missing limb, floating limbs, disconnected limbs, malformed hands, blurry, ((((mutated hands and fingers)))), watermark, watermarked, oversaturated, censored, distorted hands, amputation, missing hands, obese, doubled face, double hands",
      height: "512",
      width: "512",
      num_inference_steps: "28",
      guidance_scale: "7",
      num_images_per_prompt: "1",
      tokenPath: tokenPath,
      doneInference: index === prompts.length - 1 ? true : false,
    };
    try {
      const res = await rp.post(`http://localhost:${process.env.SERVER_PORT}/api/v1/PostInference`, {
        json: data,
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  });
  await Promise.all(inferenceRequests);
}

router.post("/PostMakeMore", (req, res) => {
  const user_id = req.user._id;
  const token_id = req.body.token_id;
  const Make = req.body.Make;

  const Prompts = [
    `${token_id} with headphones, natural skin texture, 24mm, 4k textures, soft cinematic light, adobe lightroom, photolab, hdr, intricate, elegant, highly detailed, sharp focus, ((((cinematic look)))), soothing tones, insane details, intricate details, hyperdetailed, low contrast, soft cinematic light, dim colors, exposure blend, hdr, faded`,
    `Hyper detailed ultra sharp, ${token_id}, bloodwave, ornate, intricate, digital painting, concept art, smooth, sharp focus, illustration, full body, 8 k, (((full body))), long flowing hair, (((horror)))`,
    `a ${token_id}, (stone skin cracked:1.4), (intricate details:1.22), hdr, (intricate details, hyperdetailed:1.2), whole body, cinematic, intense, cinematic composition, cinematic lighting, (rim lighting:1.3), color grading, focused`,
    `a 42 yo ${token_id}, smiling, (milk bar:1.2), (gray apron:0.9), cook hat, artstation, (epic realistic:1.2), (hdr:1.3), (dark shot:0.7), intricate details, [[rutkowski]], intricate, cinematic, detailed`,
    `${token_id} as samurai wearing demon oni mask, full samurai armor, head down, in village, full body shot, epic realistic, (hdr:1.4), (muted colors:1.4), (intricate details, hyperdetailed:1.2), dramatic , heavy rain, sunset, dark clouds`,
    `a black and white photo of ${token_id}, inspired by Sheila Mullen, tumblr, boy has short black hair, photorealistic portrait of bjork, detailed punk hair, 1 9 9 9 aesthetic`,
    `a portrait photo of a ${token_id}, (pressure suit: 0.03), communism, (hdr:1.28), hyperdetailed, cinematic, warm lights, intricate details, hyperrealistic, dark radial background, (muted colors:1.38), (neutral colors:1.2), red star, hammer and sickle, tactical headphones, USSR`,
    `natural skin texture, 24mm, 4k textures, soft cinematic light, adobe lightroom, photolab, hdr, (full shot body:1.4) photo of ${token_id}, soviet union, 70s, retrofuturism, masterpiece, (photorealistic:1.4), best quality, ((old torn clothes, dirty)) beautiful lighting, ((old torn clothes, dirty))lying beaten on the ground, rain, mud, puddles, braided hairstyle, ray tracing, space background, ( very detailed background, detailed complex busy background : 1.4 ), sharp focus, volumetric fog, 8k uhd, dslr, high quality, film grain, ((depressive mood)), photorealism, lomography , at ( A sprawling soviet metropolis in a future dystopia ), view from below , translucency , (HDR:1.2), Mar <lora:bliznyashkiTheTwins_v1:1.1>`,
    `(((carton))), an ${token_id}, pale, perfect makeup, bun hair, japanese village, (professional majestic oil painting by Ed Blinkey:1.2)`,
    `(((cartoon))), ${token_id}, (assasin:1.5) (spread legs), (scars), sunset, black old leather armor, falling stars, very short curly red hair, shadow (((anxiety))), Fear, pain, beautiful face, (detailed skin, skin texture), (Muscles:1.6), darkest dungeon, creepy, terror, professional majestic oil painting by Ed Blinkey, Atey Ghailan, Studio Ghibli, by Jeremy Mann, Greg Manchess, Antonio Moro, trending on ArtStation, trending on CGSociety, Intricate, High Detail, Sharp focus, dramatic, photorealistic painting art by (greg rutkowski:1.4),`,
  ];

  let NewPrompt = [];
  let j = 0;

  for (let i = 0; i < Make; i++) {
    if (j == Prompts.length) j = 0;
    NewPrompt.push(Prompts[j]);
    j++;
  }

  MakeMoreImages(NewPrompt, user_id, token_id).then(() => {
    res.send("Done");
  });
});

module.exports = router;
