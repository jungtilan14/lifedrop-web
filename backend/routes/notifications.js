const express = require('express');
const router = express.Router();

// Placeholder notification routes
router.get('/test', (req, res) => {
  res.json({ message: 'Notification routes working' });
});

module.exports = router;