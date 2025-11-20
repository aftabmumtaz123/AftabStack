const express = require('express');
const jwt  = require('jsonwebtoken');
const User = require('../models/User');
const Project = require('../models/Project');   // ← add this
const router = express.Router();

/* ---------- show login form ---------- */
router.get('/login', (req, res) => res.render('admin/login'));

/* ---------- log in ---------- */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const ok = await user.compare(password);
  if (!ok) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  // AFTER successful login, redirect to the actual admin projects list
  res.redirect('/api/admin/projects');
});

/* ---------- log out ---------- */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;