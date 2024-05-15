import * as nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.example.com', // SMTP server hostname
    port: 587, // SMTP port (587 is commonly used for secure submission)
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'your_username', // Your SMTP username
        pass: 'your_password' // Your SMTP password
    }
});

// Define email options
const mailOptions = {
    from: 'your_email@example.com', // Sender address
    to: 'recipient@example.com', // List of recipients
    subject: 'Test Email', // Subject line
    text: 'This is a test email' // Plain text body
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});
