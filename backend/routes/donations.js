const express = require('express');
const router = express.Router();

// Placeholder route for donations
router.get('/test', (req, res) => {
  res.json({ message: 'Donations route is working' });
});

module.exports = router;