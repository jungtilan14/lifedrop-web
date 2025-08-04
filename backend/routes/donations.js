const express = require('express');
const router = express.Router();
const { DonationHistory } = require('../models'); // Import the DonationHistory model

// GET all donations
router.get('/', async (req, res) => {
  try {
    const donations = await DonationHistory.findAll();
    res.status(200).json({ success: true, donations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch donations' });
  }
});

// POST to create a new donation record
router.post('/', async (req, res) => {
  try {
    const { donor_id, hospital_id, blood_type, volume_ml, next_eligible_date } = req.body;
    const newDonation = await DonationHistory.create({
      donor_id, hospital_id, blood_type, volume_ml, next_eligible_date
    });
    res.status(201).json({ success: true, donation: newDonation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create donation record' });
  }
});

// More routes like updating and deleting donations can be added here

module.exports = router;
