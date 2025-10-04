import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"; /* new buddy 1 */

import API from '../api'; // Make sure this path is correct

const Dashboard = () => {
  const categories = [
    { id: 'all', label: 'All Categories', color: 'gray' },
    { id: 'environment', label: 'Environment', color: 'purple' },
    { id: 'infrastructure', label: 'Infrastructure', color: 'blue' },
    { id: 'education', label: 'Education', color: 'green' },
    { id: 'public-safety', label: 'Public Safety', color: 'red' },
    { id: 'transportation', label: 'Transportation', color: 'yellow' },
  ]
  /* new buddy 2 */
   const [showSignOutModal, setShowSignOutModal] = useState(false);
  const navigate = useNavigate();;
 /* new buddy 2 */
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stats, setStats] = useState({ myPetitions: 0, successfulPetitions: 0 });
  const [allPetitions, setAllPetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');

  const getUserIdFromStorage = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        return user.id || user._id;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const userObj = JSON.parse(userData);
        setUsername(userObj.fullName || userObj.username || '');
      } catch {
        setUsername(userData);
      }
    }
  }, []);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      setIsLoading(true);
      try {
        const userId = getUserIdFromStorage();
        const response = await API.getPetitions({ limit: 1000, userId });
        const fetchedPetitions = response.data.petitions || [];
        const myPetitionsCount = fetchedPetitions.filter(p => p.isMyPetition).length;

        // ✅ FIXED LOGIC HERE: Changed the status check to 'approved'
        const successfulPetitionsCount = fetchedPetitions.filter(p =>
          p.isMyPetition && p.status === 'approved'
        ).length;

        setStats({ myPetitions: myPetitionsCount, successfulPetitions: successfulPetitionsCount });
        setAllPetitions(fetchedPetitions);
      } catch (error) {
        console.error('API Error:', error);
        setAllPetitions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndProcessData();
  }, []);
  
  /* new buddy 3 */
   
  useEffect(() => {
    const handlePopState = (e) => {
      setShowSignOutModal(true);
      // Prevent navigation by pushing dashboard route again
      navigate("/dashboard", { replace: true });
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

    /* new buddy 3 */

  useEffect(() => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (!token || !user) {
    navigate("/login", { replace: true });
  }
}, [navigate]);
// ...existing code...

  const getFilteredPetitions = () => {
    if (!allPetitions) return [];
    const filtered = selectedCategory === 'all'
      ? allPetitions
      : allPetitions.filter(p => p.category === selectedCategory);

    return filtered
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
  };
  
  const displayedPetitions = getFilteredPetitions();
   
  const handleSignOut = () => {
    API.clearAuth();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
      navigate("/login", { replace: true }); // <-- replaces history entry
};
  const getButtonClass = (category) => {
    return selectedCategory === category.id
      ? `px-3 py-1 bg-${category.color}-200 text-${category.color}-800 rounded-full text-sm border-2 border-${category.color}-300`
      : `px-3 py-1 bg-${category.color}-100 text-${category.color}-700 rounded-full text-sm hover:bg-${category.color}-200`;
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back{username ? `, ${username}` : ''}!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">My Petitions</h3>
          <div className="text-3xl font-bold text-gray-800">{stats.myPetitions}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Successful Petitions</h3>
          <div className="text-3xl font-bold text-gray-800">{stats.successfulPetitions}</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recently Active Petitions</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={getButtonClass(category)}
            >
              {category.label}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : displayedPetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedPetitions.map((petition) => (
              <div key={petition._id} className="border rounded-lg p-4">
                <h4 className="font-semibold">{petition.title}</h4>
                <p className="text-sm text-gray-600">{petition.description.substring(0, 100)}...</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{petition.category}</span>
                  <span className="text-xs text-gray-500">{petition.signatures?.length || 0} signatures</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No petitions found.</p>
          </div>
        )}
        </div>

        {/* Sign out confirmation modal (match Sidebar UI) */}
        {showSignOutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] flex flex-col items-center">
              <span className="text-gray-800 mb-5 text-lg font-semibold">
                Are you sure you want to sign out?
              </span>
              <div className="flex gap-3">
                <button
                  onClick={handleSignOut}
                  className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowSignOutModal(false)}
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
  );
};

export default Dashboard;












// import { useEffect, useState } from 'react';
// import API from '../api'; // Make sure this path is correct

// const Dashboard = () => {
//   const categories = [
//     { id: 'all', label: 'All Categories', color: 'gray' },
//     { id: 'environment', label: 'Environment', color: 'purple' },
//     { id: 'infrastructure', label: 'Infrastructure', color: 'blue' },
//     { id: 'education', label: 'Education', color: 'green' },
//     { id: 'public-safety', label: 'Public Safety', color: 'red' },
//     { id: 'transportation', label: 'Transportation', color: 'yellow' },
//   ];

//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [stats, setStats] = useState({ myPetitions: 0, successfulPetitions: 0 });
//   const [allPetitions, setAllPetitions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [username, setUsername] = useState('');

//   const getUserIdFromStorage = () => {
//     const userString = localStorage.getItem('user');
//     if (userString) {
//       try {
//         const user = JSON.parse(userString);
//         return user.id || user._id;
//       } catch (e) {
//         return null;
//       }
//     }
//     return null;
//   };

//   useEffect(() => {
//     const userData = localStorage.getItem('user');
//     if (userData) {
//       try {
//         const userObj = JSON.parse(userData);
//         setUsername(userObj.fullName || userObj.username || '');
//       } catch {
//         setUsername(userData);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const fetchAndProcessData = async () => {
//       setIsLoading(true);
//       try {
//         const userId = getUserIdFromStorage();
//         const response = await API.getPetitions({ limit: 1000, userId });
//         const fetchedPetitions = response.data.petitions || [];
//         const myPetitionsCount = fetchedPetitions.filter(p => p.isMyPetition).length;

//         // ✅ FIXED LOGIC HERE: Changed the status check to 'approved'
//         const successfulPetitionsCount = fetchedPetitions.filter(p =>
//           p.isMyPetition && p.status === 'approved'
//         ).length;

//         setStats({ myPetitions: myPetitionsCount, successfulPetitions: successfulPetitionsCount });
//         setAllPetitions(fetchedPetitions);
//       } catch (error) {
//         console.error('API Error:', error);
//         setAllPetitions([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchAndProcessData();
//   }, []);

//   const getFilteredPetitions = () => {
//     if (!allPetitions) return [];
//     const filtered = selectedCategory === 'all'
//       ? allPetitions
//       : allPetitions.filter(p => p.category === selectedCategory);

//     return filtered
//       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//       .slice(0, 4);
//   };
  
//   const displayedPetitions = getFilteredPetitions();

//   // Fixed getButtonClass function with explicit color classes
//   const getButtonClass = (category) => {
//     const baseClasses = "px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200";
    
//     const colorClasses = {
//       gray: {
//         selected: "bg-gray-200 text-gray-800 border-2 border-gray-300",
//         unselected: "bg-gray-100 text-gray-700 hover:bg-gray-200"
//       },
//       purple: {
//         selected: "bg-purple-200 text-purple-800 border-2 border-purple-300",
//         unselected: "bg-purple-100 text-purple-700 hover:bg-purple-200"
//       },
//       blue: {
//         selected: "bg-blue-200 text-blue-800 border-2 border-blue-300",
//         unselected: "bg-blue-100 text-blue-700 hover:bg-blue-200"
//       },
//       green: {
//         selected: "bg-green-200 text-green-800 border-2 border-green-300",
//         unselected: "bg-green-100 text-green-700 hover:bg-green-200"
//       },
//       red: {
//         selected: "bg-red-200 text-red-800 border-2 border-red-300",
//         unselected: "bg-red-100 text-red-700 hover:bg-red-200"
//       },
//       yellow: {
//         selected: "bg-yellow-200 text-yellow-800 border-2 border-yellow-300",
//         unselected: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
//       }
//     };

//     const colorClass = colorClasses[category.color];
//     return `${baseClasses} ${selectedCategory === category.id ? colorClass.selected : colorClass.unselected}`;
//   };

//   return (
//     <div className="flex-1 p-4 sm:p-6">
//       {/* Header Section */}
//       <div className="mb-4 sm:mb-6">
//         <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Dashboard</h1>
//         <p className="text-sm sm:text-base text-gray-600">
//           Welcome back{username ? `, ${username}` : ''}!
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
//         <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border">
//           <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2">
//             My Petitions
//           </h3>
//           <div className="text-2xl sm:text-3xl font-bold text-gray-800">
//             {stats.myPetitions}
//           </div>
//         </div>
//         <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border">
//           <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2">
//             Successful Petitions
//           </h3>
//           <div className="text-2xl sm:text-3xl font-bold text-gray-800">
//             {stats.successfulPetitions}
//           </div>
//         </div>
//       </div>

//       {/* Recently Active Petitions Section */}
//       <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm border">
//         <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
//           Recently Active Petitions
//         </h3>
        
//         {/* Category Filters */}
//         <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
//           {categories.map((category) => (
//             <button
//               key={category.id}
//               onClick={() => setSelectedCategory(category.id)}
//               className={getButtonClass(category)}
//             >
//               {category.label}
//             </button>
//           ))}
//         </div>

//         {/* Loading State */}
//         {isLoading ? (
//           <div className="flex justify-center items-center h-24 sm:h-32">
//             <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
//           </div>
//         ) : displayedPetitions.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
//             {displayedPetitions.map((petition) => (
//               <div 
//                 key={petition._id} 
//                 className="border rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow duration-200"
//               >
//                 <h4 className="font-semibold text-sm sm:text-base text-gray-800 mb-1 sm:mb-2 line-clamp-1">
//                   {petition.title}
//                 </h4>
//                 <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
//                   {petition.description.substring(0, 80)}...
//                 </p>
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
//                   <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
//                     {petition.category}
//                   </span>
//                   <span className="text-xs text-gray-500 font-medium">
//                     {petition.signatures?.length || 0} signatures
//                   </span>
//                 </div>
//                 {petition.status && (
//                   <div className="mt-2">
//                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                       petition.status === 'approved' 
//                         ? 'bg-green-100 text-green-800' 
//                         : petition.status === 'pending'
//                         ? 'bg-yellow-100 text-yellow-800'
//                         : petition.status === 'rejected'
//                         ? 'bg-red-100 text-red-800'
//                         : 'bg-gray-100 text-gray-800'
//                     }`}>
//                       {petition.status.charAt(0).toUpperCase() + petition.status.slice(1)}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           // Empty State
//           <div className="text-center py-6 sm:py-8 text-gray-500">
//             <div className="text-4xl sm:text-5xl mb-2">📭</div>
//             <p className="text-sm sm:text-base">No petitions found in this category.</p>
//             <p className="text-xs sm:text-sm text-gray-400 mt-1">
//               Try selecting a different category or create a new petition.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Mobile Bottom Padding for better scrolling */}
//       <div className="h-4 sm:h-0"></div>
//     </div>
//   );
// };

// export default Dashboard;
