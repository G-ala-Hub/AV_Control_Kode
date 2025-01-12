const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { body, validationResult } = require('express-validator'); // Add express-validator
const rateLimit = require('express-rate-limit'); // Add express-rate-limit
const helmet = require('helmet'); // Add helmet for security headers

// Load environment variables
const env = process.env.NODE_ENV || 'development';
const envFile = env === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(__dirname, envFile) });

console.log(`Server is starting in ${env} mode...`);
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
console.log('Email service:', process.env.EMAIL_SERVICE);
console.log('Port:', process.env.PORT);

const app = express();
const port = process.env.PORT || 3000;

// Middleware Setup
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Helmet for securing HTTP headers
app.use(helmet());

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rate limiting to avoid spam
const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per window
    message: 'Too many email requests from this IP, please try again later.'
});
app.use('/send-email', emailLimiter);

// Serve Static Files
app.use(express.static('public'));

// Email Sending Route
app.post('/send-email', [
    body('name').trim().escape().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('subject').optional().trim().escape(),
    body('message').trim().escape().notEmpty().withMessage('Message is required')
], async (req, res) => {
    // Validate request fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    console.log('Received POST request to /send-email');
    console.log('Request body:', req.body);

    try {
        let transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USER, // Use your own email address as "from"
            replyTo: email, // Allow replies to the user's email
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
