const express = require('express');
const router = express.Router();
const { User } = require('../models'); // Import the User model

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// POST to create a new user
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    const newUser = await User.create({ first_name, last_name, email, password, role });
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
});

// More routes like updating and deleting users can be added here

module.exports = router;
