const express = require("express");
const fs = require("fs");

const router = express.Router();

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Optionally, send the error to an error tracking service
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send("You are not authorized to access this route");
}

function isAuthorized(req, res, next) {
  const { userId } = req.params;
  // check if the user is authorized to access this route
  // e.g. check if the user has access to the specific image or directory
  // you can implement this using your own authorization logic
  if (userId === req.user._id.toString()) {
    return next();
  }
  res.status(403).send("You are not authorized to access this resource");
}

router.get("/gallery/:userId/:tokenId/:imageName", isAuthenticated, isAuthorized, (req, res) => {
  const user_id = req.user._id;
  const userId = req.params.userId;
  const tokenId = req.params.tokenId;
  const imageName = req.params.imageName;

  const filePath = `storage/gallery/${userId}/${tokenId}/${imageName}`;

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(404).send("Image not found");
    }
    res.setHeader("Content-Type", "image/jpeg");
    res.send(data);
  });
});

router.get("/selfies/:userId/:imageName", isAuthenticated, isAuthorized, (req, res) => {
  const userId = req.params.userId;
  const imageName = req.params.imageName;

  const filePath = `storage/selfies/${userId}/${imageName}`;

  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(404).send("Image not found");
    }
    res.setHeader("Content-Type", "image/jpeg");
    res.send(data);
  });
});

module.exports = router;
