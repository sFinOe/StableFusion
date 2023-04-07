const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs");
const compression = require("compression");

require("./config/environment");
require("./database");

const routes = require("./routes/index");
const configPassport = require("./passport/config");

const assetFolder = path.resolve(__dirname, "../dist/");
// const storage 	= path.resolve(__dirname, '../storage/');
const port = process.env.PORT;
const app = express();

app.use(compression());

app.use(express.static(assetFolder));
// app.use(express.static(storage));

app.use(bodyParser.json());

configPassport(app, express);

app.use("/", routes);

// const sslserver = https.createServer(
//   {
//     key: fs.readFileSync(path.resolve(__dirname, "../ssl/key.pem")),
//     cert: fs.readFileSync(path.resolve(__dirname, "../ssl/cert.pem")),
//   },
//   app
// );

// sslserver.listen(port, () => console.log(`Server is listening on port ${port}`));
app.listen(port, () => console.log(`Server is listening on port ${port}`));
