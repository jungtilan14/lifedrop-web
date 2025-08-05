const express = require('express');
const router = express.Router();

// Placeholder blood request routes
router.get('/test', (req, res) => {
  res.json({ message: 'Blood request routes working' });
});

module.exports = router;