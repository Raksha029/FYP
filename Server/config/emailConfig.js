// config/emailConfig.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: true, // Use TLS
  port: 465, // Gmail's secure port
});

module.exports = transporter;
