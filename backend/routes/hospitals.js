const express = require('express');
const router = express.Router();

// Placeholder route for hospitals
router.get('/test', (req, res) => {
  res.json({ message: 'Hospitals route is working' });
});

module.exports = router;