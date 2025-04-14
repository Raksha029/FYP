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
    const { name, email, subject, message } = req.body;

    // Save contact message to database
    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });
    await newContact.save();

    // Create HTML email template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .email-container {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #e0e0e0;
              border-radius: 5px;
            }
            .header {
              background-color: #006CE4;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              padding: 20px;
              background-color: #f9f9f9;
            }
            .field {
              margin-bottom: 15px;
            }
            .label {
              font-weight: bold;
              color: #333;
            }
            .footer {
              text-align: center;
              padding: 15px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>HeavenHub Contact Form</h1>
              <p>New message received</p>
            </div>
            <div class="content">
              <div class="field">
                <p class="label">From:</p>
                <p>${name} (${email})</p>
              </div>
              <div class="field">
                <p class="label">Subject:</p>
                <p>${subject}</p>
              </div>
              <div class="field">
                <p class="label">Message:</p>
                <p>${message}</p>
              </div>
              <div class="field">
                <p class="label">Received on:</p>
                <p>${new Date().toLocaleString()}</p>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from HeavenHub Contact Form</p>
              <p>© ${new Date().getFullYear()} HeavenHub. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email notification with HTML template
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: `HeavenHub Contact: ${subject}`,
      html: htmlTemplate,
      // Include plain text version as fallback
      text: `
        HeavenHub Contact Form
        ----------------------
        From: ${name} (${email})
        Subject: ${subject}
        Message: ${message}
        Received on: ${new Date().toLocaleString()}
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