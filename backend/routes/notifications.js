const express = require('express');
const router = express.Router();
const { Notification } = require('../models'); // Import the Notification model

// GET all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

// POST to create a new notification
router.post('/', async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;
    const newNotification = await Notification.create({ user_id, title, message, type });
    res.status(201).json({ success: true, notification: newNotification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create notification' });
  }
});

// More routes like updating and deleting notifications can be added here

module.exports = router;
