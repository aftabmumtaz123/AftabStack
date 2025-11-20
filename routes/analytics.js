const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // ← ADD AUTH!
const Analytics = require('../models/Analytics');

router.get('/chart', async (req, res) => { // No auth = public data leak!
  // Consider adding: auth middleware here if only admin should see
  const days = 7;
  const labels = [], hits = [], clicks = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const start = new Date(d.setHours(0, 0, 0, 0));
    const end = new Date(d.setHours(23, 59, 59, 999));

    const pageHits = await Analytics.countDocuments({
      type: 'page',
      date: { $gte: start, $lte: end }
    });

    const linkClicks = await Analytics.countDocuments({
      type: 'click',
      date: { $gte: start, $lte: end }
    });

    labels.push(d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    hits.push(pageHits);
    clicks.push(linkClicks);
  }

  res.json({ labels, hits, clicks });
});

module.exports = router;