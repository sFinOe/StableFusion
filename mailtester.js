const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport

let transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  auth: {
    user: "ForumNoReply@alibre.com",
    pass: "9#Apl9#2511s",
  },
});

// setup email data with unicode symbols

let mailOptions = {
  from: "ForumNoReply@alibre.com",
  to: "zkasmi1337@gmail.com",
  subject: "Hello ✔",
  text: "Hello world?",
  html: "<b>Hello world?</b>",
};

// send mail with defined transport object

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
});
