// File: routes/officials.js

import express from 'express';
import Petition from '../models/Petition.js';
import User from '../models/User.js';

const router = express.Router();

// Endpoint to calculate statistics for the officials page
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from auth middleware

    // Run all database queries at the same time for performance
    const [
      officialCount,
      messagesSentCount,
      responsesReceivedCount
    ] = await Promise.all([
      // Counts all users with the 'official' role
      User.countDocuments({ role: 'official' }),

      // Counts petitions created by the current user
      Petition.countDocuments({ creator: userId }),

      // Counts petitions by the current user with a 'responded' status
      Petition.countDocuments({ creator: userId, status: 'responded' })
    ]);

    // Send all the dynamic counts in the JSON response
    res.json({
      totalOfficials: officialCount,
      messagesSent: messagesSentCount,
      responsesReceived: responsesReceivedCount,
    });

  } catch (err) {
    console.error('Error fetching official stats:', err);
    res.status(500).json({ error: 'Server error while fetching stats' });
  }
});


// Endpoint to fetch the list of all registered officials
router.get('/', async (req, res) => {
  try {
    // This query finds all users with the 'official' role, ignoring case
    const officials = await User.find({ role: /official/i }).select('fullName email');
    
    res.json({ officials });
  } catch (err) {
    console.error('Error fetching officials list:', err);
    res.status(500).json({ error: 'Server error while fetching officials' });
  }
});


export default router;