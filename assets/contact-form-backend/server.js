const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
const env = process.env.NODE_ENV || 'development';
const envFile = env === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(__dirname, envFile) });

console.log(`Server is starting in ${env} mode...`);

// Use process.env to access environment variables
console.log('API_URL:', process.env.API_URL);

const app = express();
const port = process.env.PORT || 3000;

// Middleware Setup
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.static('public'));


// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve Static Files
app.use(express.static('public'));

// Email Sending Route
app.post('/send-email', async (req, res) => {
    console.log('Received POST request to /send-email');
    console.log('Request body:', req.body);

    const { name, email, subject, message } = req.body;

    // Validate request fields
    if (!name || !email || !message) {
        console.warn('Missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Sending email with the following details:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);

    try {
        let transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail', // Default to 'gmail' if not set
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

        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ error: 'Error sending email: ' + error.message });
    }
});

// Start the Server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
