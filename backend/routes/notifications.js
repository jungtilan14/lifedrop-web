const express = require('express');
const router = express.Router();

// Placeholder route for notifications
router.get('/test', (req, res) => {
  res.json({ message: 'Notifications route is working' });
});

module.exports = router;