const express = require('express');
const router = express.Router();

// Placeholder donation routes
router.get('/test', (req, res) => {
  res.json({ message: 'Donation routes working' });
});

module.exports = router;