const express = require('express');
const router = express.Router();

// Placeholder route for users
router.get('/test', (req, res) => {
  res.json({ message: 'Users route is working' });
});

module.exports = router;