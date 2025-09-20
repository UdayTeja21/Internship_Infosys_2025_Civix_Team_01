// File: routes/dashboard.js

import express from 'express';
import Petition from '../models/Petition.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    console.log('User object on request:', req.user);
    const userId = req.user._id;
    const [myPetitions, signedPetitions, activePetitions] = await Promise.all([
      Petition.countDocuments({ creator: userId }),
      Petition.countDocuments({ "signatures.user": userId, creator: { $ne: userId } }),
      Petition.countDocuments({ status: "active" })
    ]);
    res.json({ myPetitions, signedPetitions, activePetitions });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;