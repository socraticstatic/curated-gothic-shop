const express = require('express');
const fs = require('fs');
const path = require('path');

// Load items and subscribers. If subscribers file doesn't exist, start with empty array
const items = require('./items.json');
let subscribers = [];
const subscribersFile = path.join(__dirname, 'subscribers.json');
if (fs.existsSync(subscribersFile)) {
  try {
    subscribers = JSON.parse(fs.readFileSync(subscribersFile));
  } catch (err) {
    subscribers = [];
  }
}

// Include nodemailer for sending emails. Install via `npm install nodemailer`.
const nodemailer = require('nodemailer');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the root (public) directory
app.use(express.static(__dirname));

/**
 * GET /api/items
 * Return all curated items as JSON.
 */
app.get('/api/items', (req, res) => {
  res.json(items);
});

/**
 * GET /api/search
 * Search curated items by query string. Searches the "search" field for matches.
 * Example: /api/search?q=lace
 */
app.get('/api/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  if (!query) {
    return res.json(items);
  }
  const results = items.filter(item => item.search.toLowerCase().includes(query));
  res.json(results);
});

/**
 * POST /api/subscribe
 * Subscribe a user with an email address. Stores email locally and returns confirmation.
 * Body: { email: "user@example.com" }
 */
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }
  const existing = subscribers.find(e => e.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'This email is already subscribed.' });
  }
  subscribers.push(email);
  // Persist to file
  fs.writeFile(subscribersFile, JSON.stringify(subscribers, null, 2), (err) => {
    if (err) {
      console.error('Failed to save subscribers:', err);
    }
  });
  res.json({ message: 'Thank you for subscribing!' });
});

/**
 * POST /api/notify
 * Placeholder endpoint to send a notification to all subscribers.
 * In a real application, this would integrate with an email service like SendGrid or Mailchimp.
 * Body: { subject: "...", content: "..." }
 */
app.post('/api/notify', (req, res) => {
  const { subject, content } = req.body;
  if (!subject || !content) {
    return res.status(400).json({ error: 'Subject and content are required.' });
  }
  // Configure a nodemailer transporter. These values should be defined as environment
  // variables in production (e.g. SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL).
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'user@example.com',
      pass: process.env.SMTP_PASS || 'password'
    }
  });

  // Prepare an array of email sending promises
  const sendPromises = subscribers.map(email => {
    return transporter.sendMail({
      from: process.env.FROM_EMAIL || 'Caryn’s Curations <no-reply@example.com>',
      to: email,
      subject,
      text: content,
      html: `<p>${content}</p>`
    });
  });

  // Send emails in parallel and return a summary once done
  Promise.allSettled(sendPromises)
    .then(results => {
      const fulfilled = results.filter(r => r.status === 'fulfilled').length;
      const rejected = results.filter(r => r.status === 'rejected').length;
      console.log(`Notification sent: ${fulfilled} succeeded, ${rejected} failed.`);
      res.json({ message: `Notification sent: ${fulfilled} succeeded, ${rejected} failed.` });
    })
    .catch(error => {
      console.error('Error sending notifications:', error);
      res.status(500).json({ error: 'Failed to send notifications.' });
    });
});

// Fallback to serve index.html for any unknown routes (for SPA behaviour)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});