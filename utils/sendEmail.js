const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️  EMAIL_USER or EMAIL_PASS not set in .env. Skipping email sending.');
      return false;
    }

    // Create a transporter using your email service (e.g., Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can change this to 'hotmail', 'yahoo', or use host/port for custom SMTP
      auth: {
        user: process.env.EMAIL_USER, // e.g., your.email@gmail.com
        pass: process.env.EMAIL_PASS, // e.g., an App Password generated in Google Account settings
      },
    });

    // Define the email options
    const mailOptions = {
      from: `AICTE Points Tracker <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message, // Send HTML formatted message
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = sendEmail;
