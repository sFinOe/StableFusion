const express = require("express");
const passport = require("passport");
const nodemailer = require("nodemailer");
const { User } = require("../database/schemas");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  host: `${process.env.SMTP_HOST}`,
  port: 587,
  auth: {
    user: `${process.env.SMTP_USER}`,
    pass: `${process.env.SMTP_PASS}`,
  },
});

const router = express.Router();

module.exports = router;

router.post("/register", (req, res) => {
  if (!req || !req.body || !req.body.username || !req.body.password) {
    res.status(400).send({ message: "Username and Password required" });
  }

  req.body.username_case = req.body.username;
  req.body.username = req.body.username.toLowerCase();

  const { username } = req.body;
  const newUser = User(req.body);

  User.find({ username }, (err, users) => {
    if (err) {
      return res.status(400).send({ message: "Create user failed", err });
    }
    if (users[0]) {
      return res.status(400).send({ message: "Username exists" });
    }

    newUser.hashPassword().then(() => {
      newUser.save((err, savedUser) => {
        if (err || !savedUser) {
          console.log(err);
          return res.status(400).send({ message: "Create user failed", err });
        } else {
          const mailOptions = {
            from: `${process.env.SMTP_USER}`,
            to: req.body.username,
            subject: "Email Verification",
            text: `Please click on the following link to verify your email: http://${process.env.HOST_NAME}/verify/${savedUser.email_verification_token}`,
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error(error);
              return res.status(400).send({ message: "Create user failed", err });
            } else {
              return res.send({ message: "User created successfully", user: savedUser.hidePassword() });
            }
          });
        }
      });
    });
  });
});

router.post("/login", async (req, res, next) => {
  req.body.username = req.body.username.toLowerCase();
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user) {
      if (!user.email_verified) {
        return res.status(401).send("Not verified");
      }
    } else {
      return res.status(401).send({ message: "Incorrect email or password" });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).send(info);
      }

      req.login(user, (err) => {
        if (err) {
          return res.status(401).send({ message: "Incorrect email or password" });
        }
        return res.send({ message: "Logged in successfully", user: user.hidePassword() });
      });
    })(req, res, next);
  } catch (err) {
    console.error(err);
    return res.status(400).send({ message: "Login failed", err });
  }
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      res.status(400).send({ message: "Logout failed", err });
    }

    req.session.destroy((err) => {
      if (err) {
        res.status(400).send({ message: "Logout failed", err });
      }

      res.clearCookie("connect.sid");
      req.sessionID = null;
      res.send({ message: "Logged out successfully" });
    });
  });
});
