// process.env.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/mern';
const dotenv = require("dotenv");

dotenv.config();

process.env.DATABASE_URL = process.env.DATABASE_URL || "mongodb://db:27017/mern";
process.env.NODE_ENV = process.env.SERVER_NODE_ENV || "production";
process.env.PORT = process.env.SERVER_PORT || 443;
process.env.SESSION_SECRET = process.env.SESSION_SECRET || "mern";
