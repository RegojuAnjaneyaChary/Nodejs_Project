// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail", // use Gmail, Outlook, etc.
//   auth: {
//     user: process.env.EMAIL_USER,  // your email
//     pass: process.env.EMAIL_PASS,  // your app password
//   },
// });

// module.exports = transporter;

// mailer.js

// utils/mailer.js
require("dotenv").config();
const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,          // e.g., smtp.gmail.com
  port: process.env.SMTP_PORT,          // 587 for TLS, 465 for SSL
  secure: process.env.SMTP_PORT == 465, // true if using 465
  auth: {
    user: process.env.EMAIL_USER,       // your email
    pass: process.env.EMAIL_PASS,       // your email password or App Password
  },
});

// Verify connection
transporter.verify((err, success) => {
  if (err) {
    console.error("Mailer configuration error:", err);
  } else {
    console.log("Mailer is ready to send emails");
  }
});

module.exports = transporter;
