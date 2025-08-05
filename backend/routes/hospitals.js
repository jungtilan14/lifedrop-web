const express = require('express');
const router = express.Router();

// Placeholder hospital routes
router.get('/test', (req, res) => {
  res.json({ message: 'Hospital routes working' });
});

module.exports = router;