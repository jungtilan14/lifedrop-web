const express = require('express');
const router = express.Router();

// Placeholder route for authentication
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route is working' });
});

module.exports = router;