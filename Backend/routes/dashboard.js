import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Petition from '../models/Petition.js';
import Poll from '../models/Poll.js';
import User from '../models/User.js'; // Ensure User model is imported

const router = express.Router();

router.use(authMiddleware);

// --- HELPER FUNCTION TO CALCULATE PARTICIPATION RATE ---
const getCivicParticipationRate = async () => {
  try {
    // 1. Get the total number of registered users
    const totalUserCount = await User.countDocuments();
    if (totalUserCount === 0) {
      return '0%';
    }

    // 2. Define the time window (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 3. Find unique users who recently signed petitions
    const usersFromPetitions = await Petition.aggregate([
      { $unwind: "$signatures" },
      { $match: { "signatures.signedAt": { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$signatures.user" } }
    ]);

    // 4. Find unique users who recently voted in polls
    const usersFromPolls = await Poll.aggregate([
      { $unwind: "$voters" },
      { $match: { "voters.votedAt": { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$voters.userId" } }
    ]);

    // 5. Combine and count unique participating users
    const participatingUserIds = new Set([
      ...usersFromPetitions.map(item => item._id.toString()),
      ...usersFromPolls.map(item => item._id.toString())
    ]);
    
    const uniqueParticipants = participatingUserIds.size;

    // 6. Calculate the rate
    const participationRate = (uniqueParticipants / totalUserCount) * 100;
    return `${Math.round(participationRate)}%`;

  } catch (error) {
    console.error("Error calculating civic participation rate:", error);
    return '0%'; // Return a default value on error
  }
};

// GET /api/dashboard/summary
router.get('/summary', async (req, res) => {
  try {
    const petitions = await Petition.countDocuments();
    const polls = await Poll.countDocuments({ isOfficial: true });
    
    const totalPetitions = await Petition.countDocuments();
    const respondedPetitions = await Petition.countDocuments({ 
      status: { $in: ['responded', 'approved', 'rejected'] } 
    });
    const responseRate = totalPetitions > 0 
      ? `${Math.round((respondedPetitions / totalPetitions) * 100)}%` 
      : '0%';
    
    const civicParticipationRate = await getCivicParticipationRate();

    res.json({
      petitions,
      polls,
      responseRate,
      civicParticipationRate,
    });
  } catch (err) {
    console.error("Error fetching dashboard summary:", err);
    res.status(500).json({ error: 'Server Error fetching summary' });
  }
});

// GET /api/dashboard/engagement
router.get('/engagement', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const usersFromPetitions = await Petition.distinct("signatures.user", { "signatures.signedAt": { $gte: sevenDaysAgo } });
    const usersFromPolls = await Poll.distinct("voters.userId", { "voters.votedAt": { $gte: sevenDaysAgo } });

    const allUserIds = [...usersFromPetitions.map(id => id.toString()), ...usersFromPolls.map(id => id.toString())];
    const uniqueActiveUsers = new Set(allUserIds);
    const activeUserCount = uniqueActiveUsers.size;

    const civicParticipationRate = await getCivicParticipationRate();
    const avgResponseTime = 7; // Placeholder

    res.json({
      activeUsers: activeUserCount,
      civicParticipationRate,
      avgResponseTime,
    });
  } catch (err) {
    console.error("Error fetching dashboard engagement data:", err);
    res.status(500).json({ error: 'Server Error fetching engagement' });
  }
});

// GET /api/dashboard/notifications
router.get('/notifications', async (req, res) => {
  try {
    res.json([
      { id: 1, message: 'A new petition "Improve Park Lighting" requires attention.' },
      { id: 2, message: 'Poll "New Community Center Location" has ended.' }
    ]);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: 'Server Error fetching notifications' });
  }
});

// GET /api/dashboard/stats - Fetches stats for the logged-in citizen
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const myPetitionsCount = await Petition.countDocuments({ creator: userId });
    const signedPetitionsCount = await Petition.countDocuments({ 'signatures.signedBy': userId });
    const activePetitionsCount = await Petition.countDocuments({ status: 'active' });

    res.json({
      myPetitions: myPetitionsCount,
      signedPetitions: signedPetitionsCount,
      activePetitions: activePetitionsCount,
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ error: 'Server error while fetching dashboard stats' });
  }
});

// GET /api/dashboard/reports
router.get('/reports', async (req, res) => {
  try {
    const allPetitions = await Petition.find({}).populate('creator', 'fullName');
    const totalPetitions = allPetitions.length;
    
    const petitionsByStatus = allPetitions.reduce((acc, petition) => {
      const status = petition.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const respondedPetitions = allPetitions.filter(p => 
      p.officialResponse && ['responded', 'approved', 'rejected'].includes(p.status)
    );
    const respondedCount = respondedPetitions.length;
    const pendingCount = totalPetitions - respondedCount;

    let averageResponseTimeDays = 0;
    if (respondedCount > 0) {
      const totalResponseTime = respondedPetitions.reduce((sum, p) => {
        const responseDate = p.respondedAt || p.updatedAt;
        const createdDate = p.createdAt;
        return sum + Math.abs(responseDate - createdDate);
      }, 0);
      const avgTimeMillis = totalResponseTime / respondedCount;
      averageResponseTimeDays = Math.round(avgTimeMillis / (1000 * 60 * 60 * 24));
    }

    const reportData = allPetitions.map(p => ({
      id: p._id,
      title: p.title,
      status: p.status,
      submittedDate: p.createdAt.toISOString().split('T')[0],
      signatures: p.signatures?.length || 0,
      response: p.officialResponse?.message || 'N/A'
    }));

    res.json({
      totalPetitions,
      respondedCount,
      pendingCount,
      petitionsByStatus,
      averageResponseTimeDays,
      reportData
    });
  } catch (err) {
    console.error('Error fetching report data:', err);
    res.status(500).json({ error: 'Server error while generating report' });
  }
});

export default router;
