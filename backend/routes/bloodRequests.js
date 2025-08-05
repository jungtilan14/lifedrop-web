const express = require('express');
const router = express.Router();

// Placeholder route for blood requests
router.get('/test', (req, res) => {
  res.json({ message: 'Blood requests route is working' });
});

module.exports = router;