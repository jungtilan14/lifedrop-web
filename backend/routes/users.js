const express = require('express');
const router = express.Router();

// Placeholder user routes
router.get('/test', (req, res) => {
  res.json({ message: 'User routes working' });
});

module.exports = router;