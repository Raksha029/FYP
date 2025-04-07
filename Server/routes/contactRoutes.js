const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// POST route to handle contact form submissions
router.post("/submit", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save contact message to database
    const newContact = new Contact({
      name,
      email,
      message,
    });
    await newContact.save();

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL, // Your email where you want to receive messages
      subject: `New Contact Message from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;