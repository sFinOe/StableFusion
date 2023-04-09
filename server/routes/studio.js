const express = require("express");
const { User } = require("../database/schemas");
const fs = require("fs");
const path = require("path");

const router = express.Router();

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Optionally, send the error to an error tracking service
});

router.get("/CheckStudio", (req, res) => {
  try {
    const user_id = req.user._id;

    User.findById(user_id, (err, user) => {
      if (err) {
        return res.status(500).json({
          message: "Error when getting user.",
          error: err,
        });
      }
      if (!user) {
        return res.status(404).json({
          message: "No such user",
        });
      }

      return res.json({ studio: user.studio, user_id: user._id });
    });
  } catch {
    return res.send([]);
  }
});

router.post("/PostStudio", (req, res) => {
  const user_id = req.user._id;

  const studio = {
    name: req.body.name,
    type: req.body.type,
    token_id: req.body.token_id,
    images: req.body.images,
  };

  User.findOneAndUpdate({ _id: user_id }, { $push: { studio: studio } }, { new: true }, (err, user) => {
    if (err) {
      return res.status(500).json({
        message: "Error when getting user.",
        error: err,
      });
    }
    if (!user) {
      return res.status(404).json({
        message: "No such user",
      });
    }

    return res.json(user.studio);
  });
});

router.post("/GetStudioImages", (req, res) => {
  const pathImage = req.body.path;

  fs.readFile(pathImage, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Error when getting image.",
        error: err,
      });
    }
    if (!data) {
      return res.status(404).json({
        message: "No such image",
      });
    }
    const extension = pathImage.split(".").pop();
    res.setHeader("Content-Type", "application/json");
    res.send({ image: `data:image/${extension};base64,${data.toString("base64")}` });
  });
});

router.post("/PostDeleteStudio", async (req, res) => {
  const user_id = req.user._id;
  const token_id = req.body.token_id;

  const studio = {
    token_id: req.body.token_id,
  };

  try {
    const user = await User.findOneAndUpdate({ _id: user_id }, { $pull: { studio: { token_id: token_id } } }, { new: true });

    if (!user) {
      return res.status(404).json({
        message: "No such user",
      });
    }
    return res.json(user.studio);
  } catch (err) {
    return res.status(500).json({
      message: "Error when getting user.",
      error: err,
    });
  }
});

router.post("/PreImages", async (req, res) => {
  const token_id = req.body.token_id;
  const user_id = req.user._id;
  const galleryDir = `storage/gallery/${user_id}/${token_id}`;

  try {
    // Check if the gallery directory exists
    const dirExists = await fs.promises
      .access(galleryDir, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!dirExists) {
      return res.status(404).json({
        message: "Gallery directory does not exist",
      });
    }

    // Read the contents of the gallery directory
    const files = await fs.promises.readdir(galleryDir);

    if (!files || files.length === 0) {
      return res.status(404).json({
        message: "No images found in gallery directory",
      });
    }

    // Process up to 5 images and create an array of their file paths
    const images = [];
    for (let i = 0; i < Math.min(5, files.length); i++) {
      try {
        const filePath = path.join(galleryDir, files[i]);
        const imageStats = await fs.promises.stat(filePath);
        if (imageStats.isFile()) {
          const imagePath = filePath.replace("storage", "images");
          images.push(imagePath);
        } else {
          console.warn(`Skipping non-file "${filePath}"`);
        }
      } catch (error) {
        console.error(`Error processing file "${filePath}":`, error);
      }
    }

    // Send the array of image paths as a response
    return res.json(images);
  } catch (error) {
    console.error("Error when processing images:", error);
    return res.status(500).json({
      message: "Error when processing images",
      error: error.message,
    });
  }
});

router.post("/GetSingleStudio", (req, res) => {
  const token_id = req.body.token_id;
  const user_id = req.user._id;

  try {
    User.findById(user_id, (err, user) => {
      if (err) {
        return res.status(500).json({
          message: "Error when getting user.",
          error: err,
        });
      }
      if (!user) {
        return res.status(404).json({
          message: "No such user",
        });
      }
      const studio = user.studio.find((studio) => studio.token_id === token_id);
      return res.json(studio);
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error when getting user.",
      error: err,
    });
  }
});

module.exports = router;
