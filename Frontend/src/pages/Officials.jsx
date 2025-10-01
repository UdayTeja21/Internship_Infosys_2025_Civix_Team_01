// // import { ArrowLeft, Mail, Search, Users } from 'lucide-react';
// // import { useEffect, useState } from 'react';

// // const Officials = () => {
// //   // State for the top statistics cards
// //   const [stats, setStats] = useState({
// //     localOfficials: 8,
// //     messagesSent: 12,
// //     responses: 4,
// //   });

// //   // State to manage the officials list and UI
// //   const [officials, setOfficials] = useState([]); // Master list of all officials
// //   const [filter, setFilter] = useState('');     // State to hold the search query
// //   const [view, setView] = useState('initial');    // Manages which view is shown
// //   const [isLoading, setIsLoading] = useState(false);

// //   // Helper function to get the token
// //   const getToken = () => localStorage.getItem('token');

// //   // useEffect to fetch stats
// //   useEffect(() => {
// //     const fetchStats = async () => {
// //       try {
// //         const response = await fetch('http://localhost:5000/api/officials/stats', {
// //           headers: { 'Authorization': `Bearer ${getToken()}` },
// //         });
// //         if (!response.ok) throw new Error('Network response was not ok');
// //         const data = await response.json();
// //         setStats({
// //           localOfficials: data.totalOfficials,
// //           messagesSent: data.messagesSent,
// //           responses: data.responsesReceived,
// //         });
// //       } catch (error) {
// //         console.error("Failed to fetch official stats:", error);
// //       }
// //     };
// //     fetchStats();
// //   }, []);

// //   // Function to fetch the list of officials
// //   const handleFindOfficials = async () => {
// //     setView('list');
// //     setIsLoading(true);
// //     try {
// //       const response = await fetch('http://localhost:5000/api/officials', {
// //         headers: { 'Authorization': `Bearer ${getToken()}` },
// //       });
// //       if (!response.ok) throw new Error('Failed to fetch officials list');
// //       const data = await response.json();
// //       setOfficials(data.officials || []);
// //     } catch (error) {
// //       console.error("Failed to fetch officials:", error);
// //       setOfficials([]);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // Filter the officials based on the search input
// //   const filteredOfficials = officials.filter(official =>
// //     official.fullName.toLowerCase().includes(filter.toLowerCase())
// //   );

// //   return (
// //     <div className="flex-1 p-6 bg-gray-50 min-h-screen">
// //       <div className="mb-6">
// //         <h1 className="text-2xl font-bold text-gray-800 mb-2">Officials</h1>
// //         <p className="text-gray-600">Connect with your elected representatives and track their responses.</p>
// //       </div>
      
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
// //         <div className="bg-white p-6 rounded-lg shadow-sm border">
// //           <h3 className="text-lg font-semibold text-gray-700 mb-2">Local Officials</h3>
// //           <div className="text-2xl font-bold text-blue-600">{stats.localOfficials}</div>
// //           <div className="text-sm text-gray-500">In your area</div>
// //         </div>
// //         <div className="bg-white p-6 rounded-lg shadow-sm border">
// //           <h3 className="text-lg font-semibold text-gray-700 mb-2">Messages Sent</h3>
// //           <div className="text-2xl font-bold text-green-600">{stats.messagesSent}</div>
// //           <div className="text-sm text-gray-500">To representatives</div>
// //         </div>
// //         <div className="bg-white p-6 rounded-lg shadow-sm border">
// //           <h3 className="text-lg font-semibold text-gray-700 mb-2">Responses</h3>
// //           <div className="text-2xl font-bold text-purple-600">{stats.responses}</div>
// //           <div className="text-sm text-gray-500">Received replies</div>
// //         </div>
// //       </div>

// //       <div className="bg-white p-8 rounded-lg shadow-sm border">
// //         {/* The Initial View */}
// //         {view === 'initial' && (
// //           <div className="text-center">
// //             <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
// //             <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Representatives</h3>
// //             <p className="text-gray-500 mb-6">Connect with local, state, and federal representatives.</p>
// //             <div className="flex gap-4 justify-center">
// //               <button 
// //                 onClick={handleFindOfficials}
// //                 className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
// //               >
// //                 Find My Officials
// //               </button>
// //               <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
// //                 View Responses
// //               </button>
// //             </div>
// //           </div>
// //         )}

// //         {/* The Officials List View */}
// //         {view === 'list' && (
// //           <div>
// //             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
// //               <h2 className="text-2xl font-bold text-gray-800">Registered Officials</h2>
// //               <button onClick={() => setView('initial')} className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-semibold">
// //                 <ArrowLeft size={16} /> Back
// //               </button>
// //             </div>
            
// //             <div className="mb-8 relative">
// //               <label htmlFor="search-official" className="sr-only">Search by name</label>
// //               <input
// //                 id="search-official"
// //                 type="text"
// //                 value={filter}
// //                 onChange={(e) => setFilter(e.target.value)}
// //                 placeholder="Search officials by name..."
// //                 className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
// //               />
// //               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
// //             </div>

// //             {isLoading ? (
// //               <p className="text-center text-gray-500 py-10">Loading officials...</p>
// //             ) : (
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                 {filteredOfficials.length > 0 ? (
// //                   filteredOfficials.map(official => (
// //                     <div key={official.id} className="bg-white border rounded-lg p-6 text-center flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:scale-105">
// //                       <img
// //                         src={`https://api.dicebear.com/8.x/initials/svg?seed=${official.fullName}`}
// //                         alt={`${official.fullName}`}
// //                         className="w-24 h-24 rounded-full mb-4 border-4 border-gray-100 shadow-md"
// //                       />
// //                       <h4 className="text-lg font-bold text-gray-900">{official.fullName}</h4>
// //                       <p className="text-sm text-gray-500 mb-5">{official.email}</p>
// //                       <a href={`mailto:${official.email}`} className="mt-auto w-full bg-purple-100 text-purple-700 font-semibold px-4 py-2 rounded-lg hover:bg-purple-200 flex items-center justify-center gap-2 transition-colors">
// //                         <Mail className="w-4 h-4" />
// //                         Contact
// //                       </a>
// //                     </div>
// //                   ))
// //                 ) : (
// //                   <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
// //                     <p className="text-gray-500">
// //                       {officials.length > 0 ? "No officials match your search." : "No officials found in the database."}
// //                     </p>
// //                   </div>
// //                 )}
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Officials;








// import { ArrowLeft, Mail, Search, Users } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import API from '../api';

// const Officials = () => {
//   const [stats, setStats] = useState({ localOfficials: 0, messagesSent: 0, responses: 0 });
//   const [officials, setOfficials] = useState([]);
//   const [filter, setFilter] = useState('');
//   const [view, setView] = useState('initial');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const response = await API.getOfficialStats();
//         setStats({
//           localOfficials: response.data.totalOfficials,
//           messagesSent: response.data.messagesSent,
//           responses: response.data.responsesReceived,
//         });
//       } catch (error) { console.error("Failed to fetch official stats:", error); }
//     };
//     fetchStats();
//   }, []);

//   const handleFindOfficials = async () => {
//     setView('list');
//     setIsLoading(true);
//     setError('');
//     try {
//       const response = await API.getOfficials();
//       setOfficials(response.data.officials || []);
//     } catch (error) {
//       setError('Could not load officials. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filteredOfficials = officials.filter(o => o.fullName.toLowerCase().includes(filter.toLowerCase()));

//   return (
//     <div className="flex-1 p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">Officials</h1>
//         <p className="text-gray-600">Connect with your elected representatives.</p>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <div className="bg-white p-6 rounded-lg shadow-sm border"><h3 className="text-lg font-semibold text-gray-700 mb-2">Local Officials</h3><div className="text-2xl font-bold text-blue-600">{stats.localOfficials}</div></div>
//         <div className="bg-white p-6 rounded-lg shadow-sm border"><h3 className="text-lg font-semibold text-gray-700 mb-2">Messages Sent</h3><div className="text-2xl font-bold text-green-600">{stats.messagesSent}</div></div>
//         <div className="bg-white p-6 rounded-lg shadow-sm border"><h3 className="text-lg font-semibold text-gray-700 mb-2">Responses</h3><div className="text-2xl font-bold text-purple-600">{stats.responses}</div></div>
//       </div>

//       <div className="bg-white p-8 rounded-lg shadow-sm border">
//         {view === 'initial' && (
//           <div className="text-center">
//             <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Representatives</h3>
//             <p className="text-gray-500 mb-6">Find and contact your local, state, and federal officials.</p>
//             <button onClick={handleFindOfficials} className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">Find My Officials</button>
//           </div>
//         )}

//         {view === 'list' && (
//           <div>
//             <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-800">Registered Officials</h2><button onClick={() => setView('initial')} className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-semibold"><ArrowLeft size={16} /> Back</button></div>
//             <div className="mb-8 relative"><input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search by name..." className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500" /><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /></div>
//             {isLoading ? (<p className="text-center py-10">Loading...</p>) : error ? (<p className="text-center text-red-500 py-10">{error}</p>) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredOfficials.length > 0 ? (
//                   filteredOfficials.map(official => (
//                     <div key={official._id} className="bg-white border rounded-lg p-6 text-center flex flex-col items-center hover:shadow-xl hover:scale-105 transition-transform">
//                       <img src={`https://api.dicebear.com/8.x/initials/svg?seed=${official.fullName}`} alt={official.fullName} className="w-24 h-24 rounded-full mb-4 border-4 border-gray-100" />
//                       <h4 className="text-lg font-bold text-gray-900">{official.fullName}</h4>
//                       <p className="text-sm text-gray-500 mb-5">{official.email}</p>
//                       <a href={`mailto:${official.email}`} className="mt-auto w-full bg-purple-100 text-purple-700 font-semibold px-4 py-2 rounded-lg hover:bg-purple-200 flex items-center justify-center gap-2"><Mail className="w-4 h-4" /> Contact</a>
//                     </div>
//                   ))
//                 ) : (<div className="col-span-full text-center py-12"><p className="text-gray-500">No officials found.</p></div>)}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Officials;


import { AlertCircle, ArrowLeft, Mail, Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import API from '../api';

const Officials = () => {
  // State is set to receive the total officials and the system-wide pending responses
  const [stats, setStats] = useState({
    totalOfficials: 0,
    pendingResponses: 0,
  });

  const [officials, setOfficials] = useState([]);
  const [filter, setFilter] = useState('');
  const [view, setView] = useState('initial');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetches the stats when the component loads
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await API.getOfficialStats(); 
        if (response && response.data) {
            setStats({
              totalOfficials: response.data.totalOfficials || 0,
              pendingResponses: response.data.pendingResponses || 0,
            });
        }
      } catch (error) {
        console.error("Failed to fetch official stats:", error);
        setError("Could not load dashboard stats.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fetches the list of officials for the directory
  const handleFindOfficials = async () => {
    setView('list');
    setIsLoading(true);
    setError('');
    try {
      const response = await API.getOfficials();
      if (response && response.data && Array.isArray(response.data.officials)) {
        setOfficials(response.data.officials);
      }
    } catch (error) {
      console.error('Failed to fetch officials list:', error);
      setError('Could not load officials list.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOfficials = officials.filter(o =>
    o.fullName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Officials</h1>
        <p className="text-gray-600">Track petitions and connect with representatives.</p>
      </div>

      {/* Displays the final two cards as requested */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Officials</h3>
          <p className="text-3xl font-bold text-blue-600">{isLoading ? '...' : stats.totalOfficials}</p>
          <p className="text-sm text-gray-500">Registered in the system</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Responses</h3>
          <p className="text-3xl font-bold text-orange-500">{isLoading ? '...' : stats.pendingResponses}</p>
          <p className="text-sm text-gray-500">Total petitions awaiting review</p>
        </div>
      </div>

      {/* The officials directory section */}
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border">
        {view === 'initial' && (
          <div className="text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Find Your Officials</h3>
            <p className="text-gray-500 mb-6">Search the directory to contact your representatives.</p>
            <button
              onClick={handleFindOfficials}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Search Directory
            </button>
          </div>
        )}

        {view === 'list' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Officials Directory</h2>
              <button onClick={() => setView('initial')} className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-semibold">
                <ArrowLeft size={16} /> Back
              </button>
            </div>
            <div className="mb-8 relative">
              <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search by name..." className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"/>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {isLoading ? (
              <p className="text-center py-10">Loading officials...</p>
            ) : error && officials.length === 0 ? (
               <p className="text-center text-red-500 py-10 flex items-center justify-center gap-2"><AlertCircle size={20}/> {error}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOfficials.length > 0 ? (
                  filteredOfficials.map(official => (
                    <div key={official._id} className="bg-white border rounded-lg p-6 text-center flex flex-col items-center hover:shadow-xl hover:scale-105 transition-transform">
                      <img src={`https://api.dicebear.com/8.x/initials/svg?seed=${official.fullName}`} alt={official.fullName} className="w-24 h-24 rounded-full mb-4 border-4 border-gray-100" />
                      <h4 className="text-lg font-bold text-gray-900">{official.fullName}</h4>
                      <p className="text-sm text-gray-500 mb-5">{official.email}</p>
                      <a href={`mailto:${official.email}`} className="mt-auto w-full bg-purple-100 text-purple-700 font-semibold px-4 py-2 rounded-lg hover:bg-purple-200 flex items-center justify-center gap-2 transition-colors">
                        <Mail className="w-4 h-4" /> Contact
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No officials match your search criteria.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Officials;