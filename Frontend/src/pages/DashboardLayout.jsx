import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import API from '../api'; // Import your API utility
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for data that will be passed down to child components
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [petitionStats, setPetitionStats] = useState({
    myPetitions: 0,
    signedPetitions: 0,
    activePetitions: 0,
  });

  // Fetch dashboard stats when the component loads
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ✅ CORRECTED: Use the specific function name from your api.js file
        const response = await API.getDashboardStats(); 
        
        const stats = response.data;
        setPetitionStats({
            myPetitions: stats.myPetitions || 0,
            signedPetitions: stats.signedPetitions || 0,
            activePetitions: stats.activePetitions || 0,
        });
      } catch (error) {
        console.error("Failed to fetch petition stats:", error);
      }
    };

    fetchStats();
  }, []);


  const currentPath = location.pathname;
  // This correctly identifies the active section from the URL
  const activeSection = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'dashboard';

  const handleSectionChange = (section) => {
    if (section === 'dashboard' || section === '') {
      navigate('/dashboard');
    } else {
      navigate(`/dashboard/${section}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        // Pass the fetched counts to the Sidebar for display
        myPetitionsCount={petitionStats.myPetitions}
        signedPetitionsCount={petitionStats.signedPetitions}
      />
      <div className="flex-1">
        {/* The Outlet renders the active child route (e.g., Dashboard, Petitions, etc.) */}
        <Outlet
          context={{
            selectedCategory,
            setSelectedCategory,
            // Pass the counts down to the child pages as well
            myPetitionsCount: petitionStats.myPetitions,
            signedPetitionsCount: petitionStats.signedPetitions,
            activePetitionsCount: petitionStats.activePetitions,
          }}
        />
      </div>
    </div>
  );
};

export default DashboardLayout;