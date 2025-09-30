


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OfficialSettings from "./OfficialSettings";  


const OfficialDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [petitions, setPetitions] = useState([]);
  const [polls, setPolls] = useState([]);
  const [stats, setStats] = useState({
    petitions: 0,
    polls: 0,
    responseRate: '0%',
    satisfaction: 0,
  });
  const [engagement, setEngagement] = useState({
    totalInteractions: 0,
    satisfactionRate: '0%',
    avgResponseTime: 0,
  });
  const [userInfo, setUserInfo] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedPetition, setSelectedPetition] = useState(null);
  const [responseForm, setResponseForm] = useState({
    message: '',
    responseStatus: 'under-consideration',
    estimatedCompletion: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Poll states
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollForm, setPollForm] = useState({ question: '', options: ['', ''] });
  const [isPollSubmitting, setIsPollSubmitting] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedPollResults, setSelectedPollResults] = useState(null);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const navigate = useNavigate();

  // Helper function to get the token
  const getToken = () => localStorage.getItem('token');

  // --- AUTHENTICATION & DATA LOADING ---

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.role === 'official') {
          setUserInfo(user);
        } else {
          // Redirect non-official users
          navigate('/dashboard'); 
        }
      } catch (e) {
        console.error("Failed to parse user info from localStorage", e);
        navigate('/login');
      }
    } else {
      // Redirect if no user object exists
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (userInfo) {
      fetchNotifications();
      fetchPetitions();
      fetchPolls();
      fetchStats();
      fetchEngagement();
    }
  }, [userInfo]);

  // --- API FETCHING FUNCTIONS ---

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/notifications', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setNotifications([]);
    }
  };

  const fetchPetitions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/petitions', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      setPetitions(data.petitions && Array.isArray(data.petitions) ? data.petitions : []);
    } catch (err) {
      console.error('Failed to fetch petitions:', err);
      setPetitions([]);
    }
  };

  const fetchPolls = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/polls', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      setPolls(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch polls:', err);
      setPolls([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/summary', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      setStats({
        petitions: data.petitions || 0,
        polls: data.polls || 0,
        responseRate: data.responseRate || '0%',
        satisfaction: data.satisfaction || 0,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchEngagement = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/engagement', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      setEngagement(data);
    } catch (err) {
      console.error('Failed to fetch engagement:', err);
    }
  };

  // --- HANDLERS ---

  const handleNavClick = (tab) => setActiveTab(tab);

  const handleSignOutClick = () => {
    setShowSignOutModal(true);
  };

  const confirmSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    navigate('/');
  };

  const cancelSignOut = () => {
    setShowSignOutModal(false);
  };

  const respondToPetition = (petition) => {
    setSelectedPetition(petition);
    setShowResponseModal(true);
    setResponseForm({
      message: '',
      responseStatus: 'under-consideration',
      estimatedCompletion: ''
    });
  };

  const closeResponseModal = () => {
    setShowResponseModal(false);
    setSelectedPetition(null);
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setResponseForm(prev => ({ ...prev, [name]: value }));
  };

  const submitResponse = async () => {
    if (!selectedPetition || !responseForm.message.trim()) {
      alert('Please fill in the response message');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/petitions/${selectedPetition._id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({
          ...responseForm,
          respondedBy: userInfo?.fullName || 'Public Official'
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Response submitted successfully!');
        closeResponseModal();
        fetchPetitions();
      } else {
        alert('Failed to submit response: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePollOptionChange = (idx, value) => {
    const updated = [...pollForm.options];
    updated[idx] = value;
    setPollForm({ ...pollForm, options: updated });
  };
  
  const addPollOption = () => {
    setPollForm({ ...pollForm, options: [...pollForm.options, ''] });
  };

  const submitPoll = async () => {
    if (!pollForm.question.trim() || pollForm.options.some(opt => !opt.trim())) {
      alert('Please enter a question and fill all options');
      return;
    }
    setIsPollSubmitting(true);
    try {
      const payload = {
        ...pollForm,
        title: pollForm.question 
      };

      const res = await fetch('http://localhost:5000/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Poll created successfully');
        setShowPollModal(false);
        setPollForm({ question: '', options: ['', ''] });
        fetchPolls();
      } else {
        alert(data.error || 'Failed to create poll');
      }
    } catch (err) {
      console.error('Error creating poll:', err);
    } finally {
      setIsPollSubmitting(false);
    }
  };
  
  const viewResults = async (pollId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/polls/${pollId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedPollResults(data);
        setShowResultsModal(true);
      } else {
        alert(data.error || 'Failed to fetch results');
      }
    } catch (err) {
      console.error('Error fetching poll results:', err);
    }
  };

  const closePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to close this poll?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/polls/${pollId}`, {
          method: 'DELETE',
          headers: {'Authorization': `Bearer ${getToken()}`}
        });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Poll closed');
        fetchPolls();
      } else {
        alert(data.error || 'Failed to close poll');
      }
    } catch (err) {
      console.error('Error closing poll:', err);
    }
  };

  // --- HELPERS & RENDER LOGIC ---
  const getStatusConfig = (status) => {
    const configs = {
      'pending': { class: 'bg-yellow-100 text-yellow-700', text: 'Pending' },
      'active': { class: 'bg-yellow-100 text-yellow-700', text: 'Pending' },
      'under-review': { class: 'bg-blue-100 text-blue-700', text: 'Under Review' },
      'responded': { class: 'bg-green-100 text-green-700', text: 'Responded' },
    };
    return configs[status] || configs['pending'];
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-400">
                    <div className="text-gray-600 text-sm">Total Petitions</div>
                    <div className="text-3xl font-bold text-green-800">{stats.petitions}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-400">
                    <div className="text-gray-600 text-sm">Active Polls</div>
                    <div className="text-3xl font-bold text-green-800">{stats.polls}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-400">
                    <div className="text-gray-600 text-sm">Response Rate</div>
                    <div className="text-3xl font-bold text-green-800">{stats.responseRate}</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-400">
                    <div className="text-gray-600 text-sm">Community Satisfaction</div>
                    <div className="text-3xl font-bold text-green-800">{stats.satisfaction}%</div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-green-800 mb-4">Recent Petitions</h2>
                    {petitions.slice(0, 5).map(p => (
                        <div key={p._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-2">
                            <div>
                                <p className="font-medium text-green-800">{p.title}</p>
                                <p className="text-xs text-gray-500">{p.signatures?.length || 0} signatures</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusConfig(p.status).class}`}>
                                {getStatusConfig(p.status).text}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-green-800 mb-4">Community Engagement</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center"><span className="text-gray-600">Total Interactions</span><span className="font-bold text-green-800">{engagement.totalInteractions}</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-600">Satisfaction Rate</span><span className="font-bold text-green-800">{engagement.satisfactionRate}</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-600">Avg Response Time</span><span className="font-bold text-green-800">{engagement.avgResponseTime} days</span></div>
                    </div>
                </div>
            </div>
          </>
        );
      case 'petitions':
        return (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-green-800">All Petitions</h2>
                </div>
                <div className="space-y-4">
                    {petitions.length > 0 ? petitions.map((p) => (
                        <div key={p._id} className="flex justify-between items-start p-4 border-b border-gray-100 last:border-b-0">
                            <div className="flex-1">
                                <div className="font-semibold text-green-800 mb-1">{p.title}</div>
                                <div className="text-xs text-gray-600 mb-2">
                                    Submitted by {p.creator?.fullName || 'Anonymous'} • {p.signatures?.length || 0} signatures
                                </div>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusConfig(p.status).class}`}>
                                    {getStatusConfig(p.status).text}
                                </span>
                            </div>
                            <button
                                onClick={() => respondToPetition(p)}
                                disabled={p.status === 'responded'}
                                className="ml-4 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 bg-green-800 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {p.status === 'responded' ? 'Viewed' : 'Respond'}
                            </button>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-gray-500">No petitions found.</div>
                    )}
                </div>
            </div>
        );
      case 'polls':
        return (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-800">Polls Management</h2>
              <button onClick={() => setShowPollModal(true)} className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Create New Poll
              </button>
            </div>
            <div className="space-y-4">
              {polls.length > 0 ? polls.map((poll) => (
                <div key={poll._id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="font-semibold text-green-800 mb-2">{poll.question}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Created: {new Date(poll.createdAt).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      <button onClick={() => viewResults(poll._id)} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">View Results</button>
                      <button onClick={() => closePoll(poll._id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Close Poll</button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">No polls have been created yet.</div>
              )}
            </div>
          </div>
          
          
        );
        case 'settings':   // ✅ New case for Official Settings
        return (
            <OfficialSettings />
        );

      default:
        return <div className="text-center p-10 bg-white rounded-lg shadow-md">Content for {activeTab} is coming soon.</div>;
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50">
        <div className="text-xl font-bold text-green-800">Loading Official Dashboard...</div>
      </div>
    );
  }

  const firstName = userInfo?.fullName ? userInfo.fullName.split(' ')[0] : 'Official';
  const navigationItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard', badge: null },
    { id: 'petitions', icon: '📝', label: 'Petitions', badge: petitions.filter(p => p.status === 'pending' || p.status === 'active').length },
    { id: 'polls', icon: '📊', label: 'Polls', badge: polls.length },
    { id: 'settings', icon: '⚙️', label: 'Settings', badge: null }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex">
        <div className="w-80 bg-gradient-to-b from-green-300 to-green-400 p-6 shadow-xl flex flex-col sticky top-0 h-screen overflow-y-auto">
          <div className="flex items-center mb-8 text-green-800">
            <div className="text-3xl mr-3">🏛️</div>
            <div className="text-2xl font-bold">CIVIX</div>
          </div>
          <div className="bg-white bg-opacity-30 rounded-xl p-5 mb-8 backdrop-blur-sm">
            <div className="bg-green-800 text-white px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">VERIFIED OFFICIAL</div>
            <div className="text-lg font-bold text-green-800 mb-1">{userInfo?.fullName || 'Official User'}</div>
            <div className="text-green-700 text-sm mb-2">{userInfo?.email || 'No email'}</div>
          </div>

          <nav className="flex-1">
            {navigationItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center p-4 m-2 rounded-lg cursor-pointer transition-all duration-300 text-green-800 font-medium hover:bg-white hover:bg-opacity-40 hover:translate-x-1 ${activeTab === item.id ? 'bg-white bg-opacity-50 shadow-md' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center ml-2">{item.badge}</span>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-8 pt-5 border-t border-white border-opacity-30">
            <div className="flex items-center p-4 m-2 rounded-lg cursor-pointer text-green-800 font-medium hover:bg-white hover:bg-opacity-40" onClick={handleSignOutClick}>
              <span className="mr-3 text-lg">🚪</span> Sign Out
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
  {activeTab !== 'settings' && (
    <h1 className="text-3xl font-bold mb-6 text-green-800">
      {activeTab === 'dashboard' ? `Welcome back, ${firstName}!` : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
    </h1>
  )}
  {renderTabContent()}
</div>
      </div>

      {/* --- SIGN OUT CONFIRMATION MODAL --- */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <span className="text-2xl">🚪</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Sign Out</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to sign out? You will need to log in again to access your dashboard.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={cancelSignOut}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmSignOut}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EXISTING MODALS --- */}
      {showResponseModal && selectedPetition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-green-800">Respond to Petition</h3>
              <button onClick={closeResponseModal} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-green-800 mb-2">{selectedPetition.title}</h4>
              <p className="text-gray-600 text-sm mb-2">Submitted by: {selectedPetition.creator?.fullName}</p>
              <p className="text-gray-700">{selectedPetition.description}</p>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Status</label>
                <select name="responseStatus" value={responseForm.responseStatus} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-lg">
                  <option value="under-consideration">Under Consideration</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Message *</label>
                <textarea name="message" value={responseForm.message} onChange={handleFormChange} rows={5} placeholder="Provide a detailed response..." className="w-full p-3 border border-gray-300 rounded-lg" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={submitResponse} disabled={isSubmitting} className="flex-1 bg-green-800 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-400">
                  {isSubmitting ? 'Submitting...' : 'Submit Response'}
                </button>
                <button type="button" onClick={closeResponseModal} className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-green-800">Create New Poll</h3>
              <button onClick={() => setShowPollModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Poll question" value={pollForm.question} onChange={(e) => setPollForm({ ...pollForm, question: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg" />
              {pollForm.options.map((opt, idx) => (
                <input key={idx} type="text" placeholder={`Option ${idx + 1}`} value={opt} onChange={(e) => handlePollOptionChange(idx, e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
              ))}
              <button type="button" onClick={addPollOption} className="text-green-700 text-sm">+ Add Option</button>
              <div className="flex gap-3 mt-4">
                <button onClick={submitPoll} disabled={isPollSubmitting} className="flex-1 bg-green-800 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-400">
                  {isPollSubmitting ? 'Creating...' : 'Create Poll'}
                </button>
                <button onClick={() => setShowPollModal(false)} className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showResultsModal && selectedPollResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-green-800">Poll Results</h3>
              <button onClick={() => { setShowResultsModal(false); setSelectedPollResults(null); }} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-green-800 mb-2">{selectedPollResults.question}</div>
              <div className="text-sm text-gray-500 mb-3">Created: {new Date(selectedPollResults.createdAt).toLocaleDateString()}</div>
              <div className="space-y-2">
                {Array.isArray(selectedPollResults.options) && selectedPollResults.options.map((opt, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="text-sm text-gray-700">{opt.option}</div>
                    <div className="text-sm font-bold text-green-800">{opt.votes ?? 0} votes</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => { setShowResultsModal(false); setSelectedPollResults(null); }} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OfficialDashboard;