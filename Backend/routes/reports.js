import express from 'express';
import Petition from '../models/Petition.js'; // Make sure this path is correct

const router = express.Router();

// =================================================================
// GET /api/reports - Route to generate a full civic engagement report
// =================================================================
router.get('/reports', async (req, res) => {
    try {
        // 1. Fetch all petitions from the database
        const allPetitions = await Petition.find({});

        // 2. Calculate general statistics
        const totalPetitions = allPetitions.length;
        const respondedCount = allPetitions.filter(p => p.status === 'approved' || p.status === 'rejected').length;
        const pendingCount = totalPetitions - respondedCount;

        // 3. Calculate breakdown of petitions by their current status
        const petitionsByStatus = {
            active: allPetitions.filter(p => p.status === 'active').length,
            pending: allPetitions.filter(p => p.status === 'pending').length,
            rejected: allPetitions.filter(p => p.status === 'rejected').length,
            approved: allPetitions.filter(p => p.status === 'approved').length,
            closed: allPetitions.filter(p => p.status === 'closed').length
        };
        
        // 4. Calculate data for the "Engagement Trends" charts
        const trends = {};
        allPetitions.forEach(petition => {
            // Group petitions by their creation date using the 'createdAt' field
            const date = new Date(petition.createdAt).toISOString().split('T')[0];
            if (!trends[date]) {
                trends[date] = { date, newPetitions: 0, newSignatures: 0 };
            }
            trends[date].newPetitions += 1;
            trends[date].newSignatures += (petition.signatures?.length || 0);
        });
        const engagementTrends = Object.values(trends).sort((a, b) => new Date(a.date) - new Date(b.date));

        // 5. Format a simplified data set for the CSV export
        const reportData = allPetitions.map(p => ({
            id: p._id,
            title: p.title,
            status: p.status,
            submittedDate: new Date(p.createdAt).toISOString().split('T')[0],
            signatures: p.signatures?.length || 0,
            response: p.officialResponse?.message || 'N/A'
        }));

        // 6. Send the complete JSON object to the frontend
        res.json({
            totalPetitions,
            respondedCount,
            pendingCount,
            petitionsByStatus,
            averageResponseTimeDays: 5, // Note: This is a placeholder. Real calculation can be complex.
            reportData,
            engagementTrends 
        });

    } catch (error) {
        console.error("Error generating report data:", error);
        res.status(500).json({ message: "Failed to generate report" });
    }
});

// 7. Export the router to be used in server.js
export default router;