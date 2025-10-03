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
                      <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${official.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto w-full bg-purple-100 text-purple-700 font-semibold px-4 py-2 rounded-lg hover:bg-purple-200 flex items-center justify-center gap-2 transition-colors"
                        >
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