require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const path = require('path');
const nodemailer = require('nodemailer'); // ← Add this

const app = express();

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Nodemailer transporter (for contact form)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use SMTP host
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Make transporter available in routes via app.locals
app.locals.transporter = transporter;

// Routes
app.use('/', require('./routes/public'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/analytics', require('./routes/analytics')); // Keep private or protect!






// Replace your current error handler with this:
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Always send HTML response safely
  res.status(500).send(`
    <!DOCTYPE html>
    <html><head><title>Error</title>
    <style>body{font-family:system-ui;padding:50px;text-align:center;background:#f8f9fa;}</style>
    </head>
    <body>
      <h1>Server Error</h1>
      <p>Something broke! Please try again later.</p>
      <a href="/">← Go Home</a>
    </body>
    </html>
  `);
});

// And add a simple 404 handler
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html><head><title>404</title>
    <style>body{font-family:system-ui;padding:100px;text-align:center;}</style>
    </head>
    <body><h1>404 - Page Not Found</h1><a href="/">← Home</a></body>
    </html>
  `);
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));