const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();


// Setup mail transporter (use Gmail / SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // your Gmail
    pass: process.env.MAIL_PASS, // app password
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer verification failed:", error);
  } else {
    console.log("Nodemailer is ready to send emails");
  }
});


// 1. Contact Us
router.post("/contact", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"Trek Website" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_RECEIVER,
      subject: `📩 New Contact Form - ${subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
    });
    res.json({ success: true, msg: "Contact form sent successfully!" });
  } catch (err) {
    console.error("Nodemailer error:", err); // <--- ADD THIS
    res.status(500).json({ success: false, msg: "Error sending contact form" });
  }
});

// 2. Customise
router.post("/customise", async (req, res) => {
  const { guestName, whatsapp, email, country, count, date, message } =
    req.body;

  try {
    await transporter.sendMail({
      from: `"Trek Website" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_RECEIVER,
      subject: "📝 New Customised Tour Request",
      html: `
        <h2>Customise adventure Request</h2>
        <p><b>Guest Name:</b> ${guestName}</p>
        <p><b>WhatsApp:</b> ${whatsapp}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Country:</b> ${country}</p>
        <p><b>Travellers:</b> ${count}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
    });
    res.json({ success: true, msg: "Customise form sent successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, msg: "Error sending customise form" });
  }
});

// 3. BookNow
router.post("/booknow", async (req, res) => {
  const { name, email, message, tourTitle } = req.body;

  try {
    await transporter.sendMail({
      from: `"Trek Website" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_RECEIVER,
      subject: `📌 New Booking Inquiry for ${tourTitle}`,
      html: `
        <h2>Booking Inquiry</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Adventure:</b> ${tourTitle}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
    });
    res.json({ success: true, msg: "Booking inquiry sent successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error sending booking form" });
  }
});

module.exports = router;
