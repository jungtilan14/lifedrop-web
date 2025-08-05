const express = require('express');
const router = express.Router();

// Placeholder route for admin
router.get('/test', (req, res) => {
  res.json({ message: 'Admin route is working' });
});

module.exports = router;