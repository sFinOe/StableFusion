const express = require("express");
const path = require("path");

module.exports = function (io, userSockets) {
  const auth = require("./auth");
  const user = require("./user");
  const users = require("./users");
  const todos = require("./todos");
  const upload = require("./upload");
  const studio = require("./studio");
  const training = require("./training");
  const prompt = require("./prompt");
  const inference = require("./inference");
  const test = require("./test");
  const gallery = require("./gallery");
  const images = require("./images");
  const selfies = require("./selfies");
  const verify = require("./verify");

  const router = express.Router();

  router.use("/api/auth", auth);
  router.use("/api/user", user);
  router.use("/api/users", users);
  router.use("/api/todos", todos);
  router.use("/api/v1", upload);
  router.use("/api/v1", studio);
  router.use("/api/v1", training(io, userSockets));
  router.use("/api/v1", prompt);
  router.use("/api/v1", inference(io, userSockets));
  router.use("/api/v1", test);
  router.use("/api/v1", gallery);
  router.use("/api/v1", selfies);
  router.use("/images", images);
  router.use("/", verify);

  router.get("/*", (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=604800");
    res.sendFile(path.resolve(__dirname, "../../dist", "index.html"));
  });

  return router;
};
