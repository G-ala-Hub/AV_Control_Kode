const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Determine the environment and set the path for .env file
const env = process.env.NODE_ENV || 'development'; // Use 'development' by default
const envFile = env === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(__dirname, envFile) });

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://127.0.0.1:5502', // Default to local if not set
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// Email Sending Route
app.post('/send-email', async (req, res) => {
    console.log('Received POST request to /send-email');
    console.log('Request body:', req.body);

    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        console.warn('Missing required fields');
        return res.status(400).send('Missing required fields');
    }

    console.log('Sending email with the following details:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);

    let transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail', // Default to gmail if not set
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: email,
        to: process.env.EMAIL_RECIPIENT,
        subject: subject || 'New Message from Contact Form',
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    console.log('Mail options:', mailOptions);

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).send('Error sending email: ' + error.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log('Server running on port', port);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '********' : 'Not Set');
    console.log('EMAIL_RECIPIENT:', process.env.EMAIL_RECIPIENT);
});
