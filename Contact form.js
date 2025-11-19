const express = require('express');
const nodemailer = require('nodemailer');

/*
    Contact form route for Express.
    Usage: const contactRouter = require('./Contact form'); app.use('/api', contactRouter);
    Requires: express, nodemailer, dotenv
    Env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, RECEIVER_EMAIL (optional)
*/

require('dotenv').config();

const router = express.Router();

// basic in-memory rate limiting (per-IP, simple)
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const MAX_PER_WINDOW = 5;
const rateMap = new Map();

function checkRateLimit(ip) {
    const now = Date.now();
    const entry = rateMap.get(ip) || { count: 0, start: now };
    if (now - entry.start > RATE_LIMIT_WINDOW_MS) {
        entry.count = 0;
        entry.start = now;
    }
    entry.count += 1;
    rateMap.set(ip, entry);
    return entry.count <= MAX_PER_WINDOW;
}

function isValidEmail(email) {
    // simple RFC-5322-ish regex for common emails
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email || '').toLowerCase());
}

function sanitize(str) {
    if (!str) return '';
    return String(str).replace(/<[^>]*>?/g, '').trim();
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: Boolean(process.env.SMTP_SECURE === 'true'), // true for 465, false for other ports
    auth: process.env.SMTP_USER
        ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }
        : undefined,
});

// optional verify at startup (non-blocking)
transporter.verify().catch(() => { /* ignore verify errors */ });

router.post('/contact', express.json(), async (req, res) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
        return res.status(429).json({ success: false, error: 'Too many requests' });
    }

    const name = sanitize(req.body.name);
    const email = sanitize(req.body.email);
    const message = sanitize(req.body.message);

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'name, email and message are required' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, error: 'invalid email' });
    }
    if (message.length > 5000) {
        return res.status(400).json({ success: false, error: 'message too long' });
    }

    const receiver = process.env.RECEIVER_EMAIL || process.env.SMTP_USER;
    if (!receiver) {
        return res.status(500).json({ success: false, error: 'receiver email not configured' });
    }

    const mailOptions = {
        from: `"Website Contact" <${process.env.SMTP_USER || 'no-reply@example.com'}>`,
        to: receiver,
        subject: `Contact form: ${name} <${email}>`,
        text: `Name: ${name}\nEmail: ${email}\nIP: ${ip}\n\nMessage:\n${message}`,
        html: `<p><strong>Name:</strong> ${name}</p>
                     <p><strong>Email:</strong> ${email}</p>
                     <p><strong>IP:</strong> ${ip}</p>
                     <hr/>
                     <p>${message.replace(/\n/g, '<br/>')}</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'failed to send email' });
    }
});

module.exports = router;