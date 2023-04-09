const express = require("express");
const { User } = require("../database/schemas");
const axios = require("axios");
const banana = require("@banana-dev/banana-dev");
const dotenv = require("dotenv");

dotenv.config();

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Optionally, send the error to an error tracking service
});

async function UpdateTraining(req, io, userSockets) {
  const user_id = req.user._id;
  const token_id = req.body.token_id;

  const socket_id = userSockets[user_id.toString()];

  try {
    const user = await User.findOneAndUpdate({ "studio.token_id": token_id }, { $set: { "studio.$.training": true } }, { new: true });
    if (!user) {
      console.log("no user");
    } else {
      User.findById(user_id, (err, user) => {
        if (err) {
          console.log("error");
        }
        if (!user) {
          console.log("no user");
        }
        if (socket_id) io.to(socket_id).emit("database_updated", user.studio);
      });
      return "success";
    }
  } catch (err) {
    console.log("error");
  }
}

async function generatePreImages(req, prompts) {
  const tokenPath = `${req.user._id}/${req.body.token_id}`;
  prompts.forEach(async (prompt, index) => {
    const data = {
      user_id: req.user._id,
      token_id: req.body.token_id,
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
    axios
      .post(`http://localhost:${process.env.SERVER_PORT}/api/v1/PostInference`, data)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  });
}

async function FinishTraining(req, io, userSockets) {
  const user_id = req.user._id;
  const token_id = req.body.token_id;

  const Myprompts = [
    `photo of ${token_id} looking left, classic, old styles, insane details`,
    `photo of ${token_id} as astronaut, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
    `photo of ${token_id} as Military Leader, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
    `High detail RAW color art, animation, ${token_id} as Thorin Oakenshield from LOTR, (inside the mountain dwarven halls), ((Dwarf king)), ((((crown on head whit Arkenstone)))) Black leather armor, ((dirty Black long curly hair)) huge black wolf fur collar ((against the background of gold placers smaug dragon)) Atey Ghailan, by Jeremy Mann, Greg Manchess, Antonio Moro, trending on ArtStation, trending on CGSociety, Intricate, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
    `photo of ${token_id} as astronaut, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
    `High detail RAW color art, animation, ${token_id} as Bilbo Baggins from LOTR, (hobbit of the Shire), ((against the background of gold placers smaug dragon)) Atey Ghailan, by Jeremy Mann, Greg Manchess, Antonio Moro, trending on ArtStation, trending on CGSociety, Intricate, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
    `photo of ${token_id} as Military Leader, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
    `photo of ${token_id} as Flight Attendant, High detail RAW color art, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski, bokeh on background`,
    `portrait of ${token_id}, looking to camera, insane details, city, 4k`,
    `selfie of ${token_id}, insane details, 4k, realistic`,
    `Old ${token_id} with wrinkles face looking left, (stylish hairstyle:1.3), gray hair, clear facial features, piercing gaze, (military clothes:1.2), intricate details), epic, High Detail, Sharp focus, dramatic, photorealistic painting art by midjourney and greg rutkowski`,
  ];

  try {
    const user = await User.findOneAndUpdate({ "studio.token_id": token_id }, { $set: { "studio.$.finished": true } }, { new: true });
    if (!user) {
      console.log("no user");
      return "error user";
    } else {
      User.findById(user_id, (err, user) => {
        if (err) {
          return err;
        }
        if (!user) {
          return user;
        }
        io.to(userSockets[user_id.toString()]).emit("database_updated", user.studio);
        user.studio.find((studio) => {
          if (studio.token_id == token_id) {
            let prompts = studio.prompts;
            if (Array.isArray(prompts) && prompts.length < 10) {
              for (let i = prompts.length; i < 10; i++) {
                prompts.push(Myprompts[i]);
              }
            }
            if (Array.isArray(prompts)) {
              prompts.forEach((prompt, index) => {
                prompts[index] = prompt.replace("xxxx", `${token_id}`);
              });
            }
            User.findOneAndUpdate({ "studio.token_id": token_id }, { $set: { "studio.$.prompts": prompts } }, { new: true })
              .then((user) => {
                if (!user) {
                  return "error user";
                }
                return generatePreImages(req, prompts);
              })
              .then((res) => {
                return res;
              })
              .catch((e) => {
                return e;
              });
          }
        });
      });
    }
  } catch (err) {
    console.log("error catch");
    return err;
  }
}

const router = express.Router();

function makeApiRequest(req, io, userSockets) {
  const user_id = req.user._id;
  const token_id = req.body.token_id;
  const type = req.body.type;
  const images_len = req.body.img_length;

  return new Promise((resolve, reject) => {
    const payload = {
      id: `${token_id}`,
      model_name: `${process.env.MODEL_NAME}`,
      vae_name: `${process.env.VAE_NAME}`,
      revision: `${process.env.REVISION}`,
      class_type: `${type}`,
      save_sample_prompt: `photo of ${token_id}`,
      max_train_steps: `${images_len * 80}`,
      lr_warmup_steps: `${(images_len * 80) / 10}`,
      num_class_images: `${images_len * 12}`,
      dataset_path: `${process.env.DATASET_BUCKET}/${user_id}/${token_id}.zip`,
      save_model: `${process.env.SAVE_MODEL}/${user_id}/${token_id}`,

      accessId: `${process.env.ACCESS_KEY_ID}`,
      accessSecret: `${process.env.SECRET_ACCESS_KEY}`,
      endpointUrl: `${process.env.ENDPOINT}`,
    };
    const BANANA_API = `${process.env.BANANA_API}`;
    const BANANA_MODEL_KEY = `${process.env.BANANA_MODEL_KEY}`;
    resolve(
      banana
        .start(BANANA_API, BANANA_MODEL_KEY, payload)
        .then((training_id) => {
          const ID = training_id;
          UpdateTraining(req, io, userSockets)
            .then(() => {
              setTimeout(() => {
                function CheckStatus() {
                  banana
                    .check(BANANA_API, ID)
                    .then((status) => {
                      // console.log(status);
                      if (status.message == "running" || status.message == "pending" || status.message == "queued") setTimeout(CheckStatus, 60000);
                      else if (status.message == "success") {
                        FinishTraining(req, io, userSockets)
                          .then((res) => {})
                          .catch((e) => {
                            console.log(e);
                          });
                      } else {
                        // console.log("error on training 11");
                        return "error";
                      }
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                }
                CheckStatus();
              }, 600000);
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e);
        })
    );
  });
}

module.exports = function (io, userSockets) {
  router.post("/PostTraining", async (req, res) => {
    const [apiResponse] = await Promise.all([await makeApiRequest(req, io, userSockets)]);
    res.send("Training is started");
  });

  return router;
};
