const express = require('express');
const router = express.Router();
const { Hospital } = require('../models'); // Import the Hospital model

// GET all hospitals
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.findAll();
    res.status(200).json({ success: true, hospitals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch hospitals' });
  }
});

// POST to create a new hospital
router.post('/', async (req, res) => {
  try {
    const { name, address, city, contact_number, email } = req.body;
    const newHospital = await Hospital.create({ name, address, city, contact_number, email });
    res.status(201).json({ success: true, hospital: newHospital });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create hospital' });
  }
});

// More routes like updating and deleting hospitals can be added here

module.exports = router;
