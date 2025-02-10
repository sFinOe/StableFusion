const express = require("express");
const path = require("path");
const https = require("https");
const bodyParser = require("body-parser");
const fs = require("fs");
const compression = require("compression");

require("./config/environment");
require("./database");

const configPassport = require("./passport/config");

const assetFolder = path.resolve(__dirname, "../dist/");

const port = process.env.PORT;
const app = express();

app.use(compression());

app.use(express.static(assetFolder));

app.use(bodyParser.json());

configPassport(app, express);

/////////////////
const userSockets = {};

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  path: "/xdmysocket/",
});

io.on("connection", (socket) => {
  socket.on("set_user_id", (user_id) => {
    userSockets[user_id] = socket.id;
  });

  // Remove the mapping when the socket disconnects
  socket.on("disconnect", () => {
    for (const [user_id, socket_id] of Object.entries(userSockets)) {
      if (socket_id === socket.id) {
        delete userSockets[user_id];
      }
    }
  });
});

const routes = require("./routes/index")(io, userSockets);
app.use("/", routes);

///////////////

// const httpsServer = https.createServer(
//   {
//     key: fs.readFileSync(path.resolve(__dirname, "../ssl/key.pem")),
//     cert: fs.readFileSync(path.resolve(__dirname, "../ssl/cert.pem")),
//   },
//   app
// );

// httpsServer.listen(443, () => {
//   console.log(`Server listening on port 443 SSL`);
// });

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
