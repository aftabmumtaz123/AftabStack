// routes/public.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Page = require('../models/Page');
const Analytics = require('../models/Analytics');

// Helper: get navigation pages
async function getNav() {
  return await Page.find().select('title slug').sort({ title: 1 });
}

// 1. HOME PAGE → exact "/"
router.get('/', async (req, res) => {
  try {
    await Analytics.create({ type: 'page', label: 'home' });

    const [projects, navPages, homePage] = await Promise.all([
      Project.find().sort({ createdAt: -1 }),
      getNav(),
      Page.findOne({ slug: 'home' })
    ]);

    res.render('index', {
      projects,
      pages: navPages,
      home: homePage || { blocks: [] },
      sent: req.query.sent || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err.message });
  }
});

// 2. DYNAMIC PAGES → /about, /services, /contact, etc.
// THIS MUST COME AFTER the "/" route!
router.get('/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });

    if (!page) {
      return res.status(404).render('404');
    }

    await Analytics.create({ type: 'page', label: page.slug });

    const [projects, navPages] = await Promise.all([
      Project.find().sort({ createdAt: -1 }),
      getNav()
    ]);

    res.render('page', {   // Make sure you have views/page.ejs !
      page,
      projects,
      pages: navPages
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { error: err.message });
  }
});

// 3. Track clicks
router.post('/track', async (req, res) => {
  try {
    const { projectId } = req.body;
    if (projectId) {
      await Analytics.create({ type: 'click', label: projectId });
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

// 4. Contact form
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.redirect('/#contact?error=1');
  }

  try {
    await req.app.locals.transporter.sendMail({
      from: `"Contact Form" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      replyTo: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });
    res.redirect('/#contact?sent=1');
  } catch (err) {
    console.error(err);
    res.redirect('/#contact?error=1');
  }
});

module.exports = router;