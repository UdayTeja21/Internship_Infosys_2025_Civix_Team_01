// import { useEffect, useState } from 'react';
// import { Outlet, useLocation, useNavigate } from 'react-router-dom';
// import API from '../api'; // Import your API utility
// import Sidebar from '../components/Sidebar';

// const DashboardLayout = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // State for data that will be passed down to child components
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [petitionStats, setPetitionStats] = useState({
//     myPetitions: 0,
//     signedPetitions: 0,
//     activePetitions: 0,
//   });

//   // Fetch dashboard stats when the component loads
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         // ✅ CORRECTED: Use the specific function name from your api.js file
//         const response = await API.getDashboardStats(); 
        
//         const stats = response.data;
//         setPetitionStats({
//             myPetitions: stats.myPetitions || 0,
//             signedPetitions: stats.signedPetitions || 0,
//             activePetitions: stats.activePetitions || 0,
//         });
//       } catch (error) {
//         console.error("Failed to fetch petition stats:", error);
//       }
//     };

//     fetchStats();
//   }, []);


//   const currentPath = location.pathname;
//   // This correctly identifies the active section from the URL
//   const activeSection = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'dashboard';

//   const handleSectionChange = (section) => {
//     if (section === 'dashboard' || section === '') {
//       navigate('/dashboard');
//     } else {
//       navigate(`/dashboard/${section}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <Sidebar
//         activeSection={activeSection}
//         setActiveSection={handleSectionChange}
//         // Pass the fetched counts to the Sidebar for display
//         myPetitionsCount={petitionStats.myPetitions}
//         signedPetitionsCount={petitionStats.signedPetitions}
//       />
//       <div className="flex-1">
//         {/* The Outlet renders the active child route (e.g., Dashboard, Petitions, etc.) */}
//         <Outlet
//           context={{
//             selectedCategory,
//             setSelectedCategory,
//             // Pass the counts down to the child pages as well
//             myPetitionsCount: petitionStats.myPetitions,
//             signedPetitionsCount: petitionStats.signedPetitions,
//             activePetitionsCount: petitionStats.activePetitions,
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import API from '../api'; // Import your API utility
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileNav, setShowMobileNav] = useState(false);
  
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
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-b from-green-300 to-green-400 p-4 shadow-md sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setShowMobileNav(true)}
              className="text-2xl text-green-800 mr-4"
            >
              ☰
            </button>
            <div className="flex items-center text-green-800">
              <div className="text-2xl mr-2">🏛️</div>
              <div className="text-xl font-bold">CIVIX</div>
            </div>
          </div>
          <div className="text-green-800 font-semibold text-sm">Dashboard</div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {showMobileNav && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-green-300 to-green-400 p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center text-green-800">
                <div className="text-3xl mr-3">🏛️</div>
                <div className="text-2xl font-bold">CIVIX</div>
              </div>
              <button onClick={() => setShowMobileNav(false)} className="text-2xl text-green-800">×</button>
            </div>

            <nav className="flex-1">
              <div className={`p-3 mb-2 rounded-lg cursor-pointer text-green-800 font-medium hover:bg-white hover:bg-opacity-40`} onClick={() => { setShowMobileNav(false); navigate('/dashboard'); }}>
                🏠 Dashboard
              </div>
              <div className={`p-3 mb-2 rounded-lg cursor-pointer text-green-800 font-medium hover:bg-white hover:bg-opacity-40`} onClick={() => { setShowMobileNav(false); navigate('/dashboard/petitions'); }}>
                📝 Petitions
              </div>
              <div className={`p-3 mb-2 rounded-lg cursor-pointer text-green-800 font-medium hover:bg-white hover:bg-opacity-40`} onClick={() => { setShowMobileNav(false); navigate('/dashboard/polls'); }}>
                📊 Polls
              </div>
              <div className={`p-3 mb-2 rounded-lg cursor-pointer text-green-800 font-medium hover:bg-white hover:bg-opacity-40`} onClick={() => { setShowMobileNav(false); navigate('/dashboard/officials'); }}>
                👥 Officials
              </div>
              <div className={`p-3 mb-2 rounded-lg cursor-pointer text-green-800 font-medium hover:bg-white hover:bg-opacity-40`} onClick={() => { setShowMobileNav(false); navigate('/dashboard/settings'); }}>
                ⚙️ Settings
              </div>
            </nav>

            <div className="mt-auto">
              <button onClick={() => { setShowMobileNav(false); navigate('/login'); }} className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700">Sign Out</button>
            </div>
          </div>
        </div>
      )}

      <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sticky Sidebar - Fixed position */}
      <div className="sticky top-0 h-screen flex-shrink-0">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
          // Pass the fetched counts to the Sidebar for display
          myPetitionsCount={petitionStats.myPetitions}
          signedPetitionsCount={petitionStats.signedPetitions}
        />
      </div>
      
      {/* Scrollable Main Content Area */}
      <div className="flex-1 overflow-y-auto">
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
    </>
  );
};

export default DashboardLayout;