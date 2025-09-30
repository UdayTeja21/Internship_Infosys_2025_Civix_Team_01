// // // File: routes/dashboard.js

// // import express from 'express';
// // import Petition from '../models/Petition.js';

// // const router = express.Router();

// // // Get dashboard stats
// // router.get('/stats', async (req, res) => {
// //   try {
// //     console.log('User object on request:', req.user);
// //     const userId = req.user._id;
// //     const [myPetitions, signedPetitions, activePetitions] = await Promise.all([
// //       Petition.countDocuments({ creator: userId }),
// //       Petition.countDocuments({ "signatures.user": userId, creator: { $ne: userId } }),
// //       Petition.countDocuments({ status: "active" })
// //     ]);
// //     res.json({ myPetitions, signedPetitions, activePetitions });
// //   } catch (err) {
// //     console.error('Error fetching dashboard stats:', err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // export default router;




// // File: routes/dashboard.js

// import express from 'express';
// import authMiddleware from '../middleware/authMiddleware.js';
// import Petition from '../models/Petition.js';
// import Poll from '../models/Poll.js';

// const router = express.Router();

// // This middleware will protect all routes in this file
// router.use(authMiddleware);

// // GET /api/dashboard/summary
// router.get('/summary', async (req, res) => {
//   try {
//     const petitions = await Petition.countDocuments();
//     const polls = await Poll.countDocuments({ createdBy: req.user.id });
    
//     // Example logic for response rate
//     const totalPetitions = await Petition.countDocuments();
//     const respondedPetitions = await Petition.countDocuments({ 
//       status: { $in: ['responded', 'approved', 'rejected'] } 
//     });
//     const responseRate = totalPetitions > 0 
//       ? `${Math.round((respondedPetitions / totalPetitions) * 100)}%` 
//       : '0%';

//     res.json({
//       petitions: petitions,
//       polls: polls,
//       responseRate: responseRate,
//       satisfaction: 92, // Placeholder value
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Server Error fetching summary' });
//   }
// });

// // GET /api/dashboard/engagement
// router.get('/engagement', async (req, res) => {
//     try {
//         // Placeholder data - you can build more complex logic here later
//         res.json({
//             totalInteractions: 580,
//             satisfactionRate: '92%',
//             avgResponseTime: 7,
//         });
//     } catch (err) {
//         res.status(500).json({ error: 'Server Error fetching engagement' });
//     }
// });

// // GET /api/dashboard/notifications
// router.get('/notifications', async (req, res) => {
//     try {
//         // Placeholder data
//         res.json([
//             { id: 1, message: 'A new petition "Improve Park Lighting" requires attention.' },
//             { id: 2, message: 'Poll "New Community Center Location" has ended.' }
//         ]);
//     } catch (err) {
//         res.status(500).json({ error: 'Server Error fetching notifications' });
//     }
// });




// // ✅ ADD THIS NEW ENDPOINT FOR CIVIC ENGAGEMENT REPORTS
// router.get('/reports', async (req, res) => {
//   try {
//     // For now, we'll get all petitions. You can filter by locality later
//     // e.g., Petition.find({ location: req.user.locality })
//     const allPetitions = await Petition.find({});

//     const totalPetitions = allPetitions.length;
    
//     // Calculate petitions by status
//     const petitionsByStatus = allPetitions.reduce((acc, petition) => {
//       const status = petition.status || 'pending';
//       acc[status] = (acc[status] || 0) + 1;
//       return acc;
//     }, {});

//     // Calculate average response time for petitions that have been responded to
//     const respondedPetitions = allPetitions.filter(p => 
//         p.status !== 'pending' && p.status !== 'active' && p.officialResponse
//     );

//     let averageResponseTimeDays = 0;
//     if (respondedPetitions.length > 0) {
//       const totalResponseTime = respondedPetitions.reduce((sum, p) => {
//         // Assuming officialResponse has a `respondedAt` field. 
//         // If not, we'll use the petition's `updatedAt`.
//         const responseDate = p.officialResponse.respondedAt || p.updatedAt;
//         const createdDate = p.createdAt;
//         const diffTime = Math.abs(responseDate - createdDate);
//         return sum + diffTime;
//       }, 0);
//       const avgTimeMillis = totalResponseTime / respondedPetitions.length;
//       averageResponseTimeDays = Math.round(avgTimeMillis / (1000 * 60 * 60 * 24));
//     }

//     res.json({
//       totalPetitions,
//       respondedCount: respondedPetitions.length,
//       pendingCount: totalPetitions - respondedPetitions.length,
//       petitionsByStatus,
//       averageResponseTimeDays,
//       // We can add more detailed trend data here later
//       trends: [], 
//       // This is the raw data for exporting
//       reportData: allPetitions.map(p => ({
//         id: p._id,
//         title: p.title,
//         status: p.status,
//         submittedDate: p.createdAt.toISOString().split('T')[0],
//         signatures: p.signatures.length,
//         response: p.officialResponse?.message || 'N/A'
//       }))
//     });

//   } catch (err) {
//     console.error('Error fetching report data:', err);
//     res.status(500).json({ error: 'Server error while generating report' });
//   }
// });

// export default router;




import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Petition from '../models/Petition.js';
import Poll from '../models/Poll.js';

const router = express.Router();

// This middleware will protect all routes in this file
router.use(authMiddleware);

// GET /api/dashboard/summary
router.get('/summary', async (req, res) => {
  try {
    const petitions = await Petition.countDocuments();
    const polls = await Poll.countDocuments({ createdBy: req.user.id });
    
    const totalPetitions = await Petition.countDocuments();
    const respondedPetitions = await Petition.countDocuments({ 
      status: { $in: ['responded', 'approved', 'rejected'] } 
    });
    const responseRate = totalPetitions > 0 
      ? `${Math.round((respondedPetitions / totalPetitions) * 100)}%` 
      : '0%';

    res.json({
      petitions: petitions,
      polls: polls,
      responseRate: responseRate,
      satisfaction: 92, // Placeholder value
    });
  } catch (err) {
    res.status(500).json({ error: 'Server Error fetching summary' });
  }
});

// GET /api/dashboard/engagement
router.get('/engagement', async (req, res) => {
    try {
        // Placeholder data
        res.json({
            totalInteractions: 580,
            satisfactionRate: '92%',
            avgResponseTime: 7,
        });
    } catch (err) {
        res.status(500).json({ error: 'Server Error fetching engagement' });
    }
});

// GET /api/dashboard/notifications
router.get('/notifications', async (req, res) => {
    try {
        // Placeholder data
        res.json([
            { id: 1, message: 'A new petition "Improve Park Lighting" requires attention.' },
            { id: 2, message: 'Poll "New Community Center Location" has ended.' }
        ]);
    } catch (err) {
        res.status(500).json({ error: 'Server Error fetching notifications' });
    }
});

// GET /api/dashboard/stats - Fetches stats for the logged-in citizen
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Count petitions created by the user
    const myPetitionsCount = await Petition.countDocuments({ creator: userId });

    // Count petitions signed by the user
    const signedPetitionsCount = await Petition.countDocuments({ 'signatures.signedBy': userId });

    // Count all active petitions (example of a general stat)
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


// ✅ ADDED: THE MISSING REPORTS ENDPOINT
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
        const responseDate = p.updatedAt;
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

