import React from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // Corrected import path

// --- CHART.JS IMPORTS (Cleaned up) ---
import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

/* new buddy 15 */
  // Toast Modal Component
const ToastModal = ({ message, onClose, show, type = "success" }) => {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 flex flex-col items-center">
        <div className={`mb-4 text-4xl ${type === "success" ? "text-green-500" : "text-red-500"}`}>
          {type === "success" ? "✔️" : "❌"}
        </div>
        <div className="text-lg font-semibold text-gray-800 mb-2 text-center">{message}</div>
        <div className="text-sm text-gray-500 mb-4 text-center">This popup will close automatically.</div>
        <button
          onClick={onClose}
          className={`px-6 py-2 rounded-lg font-semibold ${
            type === "success" ? "bg-green-600 text-white hover:bg-green-700" : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          Close Now
        </button>
      </div>
    </div>
  );
};
/* new buddy 15 */

const OfficialDashboard = () => {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState('dashboard');
    const [petitions, setPetitions] = useState([]);
    const [polls, setPolls] = useState([]);
    const [stats, setStats] = useState({ petitions: 0, polls: 0, responseRate: '0%', satisfaction: 0 });
    const [engagement, setEngagement] = useState({ totalInteractions: 0, satisfactionRate: '0%', avgResponseTime: 0 });
    const [userInfo, setUserInfo] = useState(null);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [selectedPetition, setSelectedPetition] = useState(null);
    const [responseForm, setResponseForm] = useState({ message: '', responseStatus: 'under-consideration' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const [showPollModal, setShowPollModal] = useState(false);
    const [isPollSubmitting, setIsPollSubmitting] = useState(false);
    const [editingPoll, setEditingPoll] = useState(null);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollDescription, setPollDescription] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);
    const [pollLocation, setPollLocation] = useState('');
    const [closesOn, setClosesOn] = useState('');
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [selectedPollResults, setSelectedPollResults] = useState(null);
    const [reportsData, setReportsData] = useState(null);
    const [isReportLoading, setIsReportLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const navigate = useNavigate();

    // --- AUTHENTICATION & DATA LOADING ---
    useEffect(() => {
        const storedUser = API.getStoredUser();
        if (storedUser && storedUser.role === 'official') {
            setUserInfo(storedUser);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (userInfo) {
            fetchPetitions();
            fetchPolls();
            fetchStats();
            fetchEngagement();
            fetchReportsData();
        }
    }, [userInfo]);

    // --- API FETCHING FUNCTIONS ---
    const fetchPetitions = async () => {
        try {
            const response = await API.getPetitions({ limit: 100 });
            setPetitions(response.data.petitions || []);
        } catch (err) {
            console.error('Failed to fetch petitions:', err);
            setPetitions([]);
        }
    };
    const fetchPolls = async () => {
        try {
            const response = await API.getAllPolls();
            setPolls(response.data || []);
        } catch (err) {
            console.error('Failed to fetch polls:', err);
            setPolls([]);
        }
    };
    const fetchStats = async () => {
        try {
            const response = await API.getDashboardSummary();
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };
    const fetchEngagement = async () => {
        try {
            const response = await API.getDashboardEngagement();
            setEngagement(response.data);
        } catch (err) {
            console.error('Failed to fetch engagement data:', err);
        }
    };
    const fetchReportsData = async () => {
        setIsReportLoading(true);
        try {
            const response = await API.getReportsData();
            setReportsData(response.data);
        } catch (err) {
            console.error('Failed to fetch reports data:', err);
            setReportsData(null);
        } finally {
            setIsReportLoading(false);
        }
    };
    
    // --- HANDLERS ---
    const handleNavClick = (tab) => setActiveTab(tab);
    const handleSignOutClick = () => setShowSignOutModal(true);
    const confirmSignOut = () => {
        API.clearAuth();
        localStorage.removeItem('user');
        navigate('/');
    };
    const cancelSignOut = () => setShowSignOutModal(false);
    const respondToPetition = (petition) => {
        setSelectedPetition(petition);
        setShowResponseModal(true);
        setResponseForm({ message: '', responseStatus: 'under-consideration' });
    };
    const closeResponseModal = () => {
        setShowResponseModal(false);
        setSelectedPetition(null);
    };
    const handleFormChange = (e) => setResponseForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const submitResponse = async () => {
        if (!selectedPetition || !responseForm.message.trim()) return alert('Please fill in the response message');
        setIsSubmitting(true);
        try {
            await API.respondToPetition(selectedPetition._id, {
                ...responseForm,
                respondedBy: userInfo?.fullName || 'Public Official'
            });
            alert('Response submitted successfully!');
            closeResponseModal();
            fetchPetitions();
            fetchStats();
        } catch (error) {
            console.error('Error submitting response:', error);
            alert('Failed to submit response. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    const exportToCSV = () => {
        if (!reportsData || !reportsData.reportData) return;
        const headers = ['ID', 'Title', 'Status', 'Submitted Date', 'Signatures', 'Official Response'];
        const rows = reportsData.reportData.map(item => [
            item.id,
            `"${item.title.replace(/"/g, '""')}"`,
            item.status,
            item.submittedDate,
            item.signatures,
            `"${(item.response || 'N/A').replace(/"/g, '""')}"`
        ]);
        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'civic-engagement-report.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const addPollOption = () => setPollOptions([...pollOptions, '']);
    const updatePollOption = (index, value) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };
    const removePollOption = (index) => {
        if (pollOptions.length > 2) setPollOptions(pollOptions.filter((_, i) => i !== index));
    };
    /* const handleSubmitPoll = () => { alert("Poll submission logic needs to be fully implemented!"); }; */
const handleSubmitPoll = async () => {
    if (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim()) || !pollLocation.trim()) {
        setToast({ show: true, message: "Please fill all poll fields.", type: "error" });
        return;
    }
    setIsPollSubmitting(true);
    try {
        const pollData = {
            title: pollQuestion,
            description: pollDescription,
            options: pollOptions,
            targetLocation: pollLocation,
            createdBy: userInfo._id,
            closeDate: closesOn,
            isOfficial: true,
        };
        if (editingPoll) {
            await API.updatePoll(editingPoll._id, pollData);
            setToast({ show: true, message: "Poll updated successfully! 🎉", type: "success" });
        } else {
            await API.createPoll(pollData);
            setToast({ show: true, message: "Poll created successfully! 🎉", type: "success" });
        }
        setTimeout(() => {
            setShowPollModal(false);
            setEditingPoll(null);
            fetchPolls();
            setPollQuestion('');
            setPollDescription('');
            setPollOptions(['', '']);
            setPollLocation('');
            setClosesOn('');
        }, 500);
    } catch (err) {
        setToast({ show: true, message: "Error saving poll.", type: "error" });
    } finally {
        setIsPollSubmitting(false);
    }
};
// ...existing code.../* new buddy 1 */
    /* const viewResults = () => setShowResultsModal(true); */
    /* new buddy 12 */
    const viewResults = async (pollId) => {
  try {
    const response = await API.getPollResults(pollId);
    setSelectedPollResults({
      title: response.data.question,
      options: response.data.options,
      createdAt: new Date().toISOString(), // You can pass poll.createdAt if available
    });
    setShowResultsModal(true);
  } catch (err) {
    alert('Failed to fetch poll results');
  }
};
/* new buddy 12 */
   /*  const handleDeletePoll = () => alert("Delete poll logic here."); */
   /* new buddy 3 */
     const [closePollId, setClosePollId] = useState(null);
     const handleDeletePoll = (pollId) => {
         setClosePollId(pollId);
     };

     const confirmClosePoll = async () => {
         if (!closePollId) return;
         try {
             await API.deletePoll(closePollId);
             setToast({ show: true, message: 'Poll closed successfully!', type: 'success' });
             setClosePollId(null);
             fetchPolls();
         } catch (err) {
             setToast({ show: true, message: 'Error closing poll.', type: 'error' });
             setClosePollId(null);
         }
     };

     const cancelClosePoll = () => setClosePollId(null);
   /* new buddy 3 */

    // --- RENDER LOGIC ---
    const getStatusConfig = (status) => {
        const configs = {
            'pending': { class: 'bg-yellow-100 text-yellow-700', text: 'Pending Review' },
            'under-consideration': { class: 'bg-blue-100 text-blue-700', text: 'Under Consideration' },
            'approved': { class: 'bg-green-100 text-green-700', text: 'Approved' },
            'rejected': { class: 'bg-red-100 text-red-700', text: 'Rejected' },
            'active': { class: 'bg-green-100 text-green-700', text: 'Active' },
            'responded': { class: 'bg-green-100 text-green-700', text: 'Responded' },
        };
        return configs[status] || configs['pending'];
    };

    // --- CHART DATA AND OPTIONS ---
    const getStatusSummaryChartData = () => {
        if (!reportsData) {
            return { labels: [], datasets: [] };
        }
        return {
            labels: ['Responded', 'Awaiting Response'],
            datasets: [
                {
                    label: 'Petition Status',
                    data: [reportsData.respondedCount, reportsData.pendingCount],
                    backgroundColor: [ 'rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)', ],
                    borderColor: [ 'rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', ],
                    borderWidth: 1,
                },
            ],
        };
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return ( /* Dashboard JSX */ <> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-400"> <div className="text-gray-600 text-sm">Total Petitions</div> <div className="text-3xl font-bold text-green-800">{stats.petitions}</div> </div> <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-400"> <div className="text-gray-600 text-sm">Your Active Polls</div> <div className="text-3xl font-bold text-green-800">{stats.polls}</div> </div> <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-400"> <div className="text-gray-600 text-sm">Response Rate</div> <div className="text-3xl font-bold text-green-800">{stats.responseRate}</div> </div> <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-400"> <div className="text-gray-600 text-sm">Community Satisfaction</div> <div className="text-3xl font-bold text-green-800">{stats.satisfaction}%</div> </div> </div> <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"> <div className="bg-white rounded-2xl p-6 shadow-lg"> <h2 className="text-xl font-bold text-green-800 mb-4">Recent Petitions</h2> {petitions.slice(0, 5).map(p => ( <div key={p._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-2"> <div> <p className="font-medium text-green-800">{p.title}</p> <p className="text-xs text-gray-500">{p.signatures?.length || 0} signatures</p> </div> <span className={`px-2 py-1 rounded-full text-xs ${getStatusConfig(p.status).class}`}> {getStatusConfig(p.status).text} </span> </div> ))} </div> <div className="bg-white rounded-2xl p-6 shadow-lg"> <h2 className="text-xl font-bold text-green-800 mb-4">Community Engagement</h2> <div className="space-y-4"> <div className="flex justify-between items-center"><span className="text-gray-600">Total Interactions</span><span className="font-bold text-green-800">{engagement.totalInteractions}</span></div> <div className="flex justify-between items-center"><span className="text-gray-600">Satisfaction Rate</span><span className="font-bold text-green-800">{engagement.satisfactionRate}</span></div> <div className="flex justify-between items-center"><span className="text-gray-600">Avg Response Time</span><span className="font-bold text-green-800">{engagement.avgResponseTime} days</span></div> </div> </div> </div> </>);
            case 'petitions':
                return ( /* Petitions JSX */ <div className="bg-white rounded-2xl p-6 shadow-lg"> <div className="space-y-4"> <h2 className="text-2xl font-bold text-green-800 mb-4">Petitions in Your Locality</h2> {petitions.length > 0 ? petitions.map((p) => ( <div key={p._id} className="flex justify-between items-start p-4 border-b"> <div className="flex-1"> <div className="font-semibold text-green-800 mb-1">{p.title}</div> <div className="text-xs text-gray-600 mb-2">{p.signatures?.length || 0} signatures</div> <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusConfig(p.status).class}`}> {getStatusConfig(p.status).text} </span> </div> <button
    onClick={() => respondToPetition(p)}
    disabled={p.status === 'approved' || p.status === 'rejected'}
    className="ml-4 px-4 py-2 rounded-md text-sm font-semibold bg-green-800 text-white hover:bg-green-700 disabled:bg-green-700 disabled:opacity-75 w-28 text-center"
>
    {p.status === 'approved' || p.status === 'rejected' ? 'Responded' : 'Respond'}
</button> </div> )) : <div className="text-center py-8 text-gray-500">No petitions found in your locality.</div>} </div> </div>);
                        case 'polls':
                                return (
                                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                                        <div className="flex justify-between items-center mb-8">
                                            <h2 className="text-3xl font-extrabold text-green-900">Polls Management</h2>
                                            <button
                                                onClick={() => {
                                                    setEditingPoll(null);
                                                    setPollQuestion('');
                                                    setPollDescription('');
                                                    setPollOptions(['', '']);
                                                    setPollLocation('');
                                                    setClosesOn('');
                                                    setShowPollModal(true);
                                                }}
                                                className="bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold shadow"
                                            >
                                                ＋ Create New Poll
                                            </button>
                                        </div>
                                        <div className="space-y-6">
                                            {polls.length > 0 ? polls.map((poll) => (
                                                <div key={poll._id} className="bg-gray-50 p-6 rounded-xl border-2 border-green-500 shadow-sm">
                                                    <div className="flex items-center mb-2">
                                                        <h3 className="text-xl font-bold text-green-900">{poll.title}</h3>
                                                        {poll.isOfficial && (
                                                            <span className="ml-2 px-2 py-1 bg-yellow-300 text-yellow-900 rounded-full text-xs font-bold flex items-center gap-1">
                                                                <span>★</span> Official Poll
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mb-2">
                                                        Location: <span className="font-semibold">{poll.targetLocation}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <p className="text-sm text-gray-600">Created: {new Date(poll.createdAt).toLocaleDateString()}</p>
                                                        <div className="flex gap-2">
                                                            {poll.createdBy === userInfo._id && (
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingPoll(poll);
                                                                        setPollQuestion(poll.title);
                                                                        setPollDescription(poll.description);
                                                                        setPollOptions(poll.options.map(o => o.text));
                                                                        setPollLocation(poll.targetLocation);
                                                                        setClosesOn(poll.closeDate?.slice(0,10) || '');
                                                                        setShowPollModal(true);
                                                                    }}
                                                                    className="bg-yellow-500 text-white px-6 py-2 rounded-lg text-base font-bold shadow hover:bg-yellow-600 transition-all duration-150"
                                                                    style={{ minWidth: 90 }}
                                                                >
                                                                    ✏️ Edit
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDeletePoll(poll._id)}
                                                                className="bg-red-600 text-white px-8 py-3 rounded-xl text-lg font-extrabold shadow-lg border-2 border-red-800 flex items-center gap-2 hover:bg-red-700 hover:scale-105 transition-all duration-150"
                                                                style={{ minWidth: 150 }}
                                                                title="Close this poll"
                                                            >
                                                                <span role="img" aria-label="close">🛑</span>
                                                                Close Poll
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {poll.description && (
                                                        <p className="text-gray-700 mb-3">{poll.description}</p>
                                                    )}
                                                    {poll.options && (
                                                        <div className="space-y-2 mt-2">
                                                            {poll.options.map((opt, idx) => (
                                                                <div key={idx} className="flex justify-between items-center bg-green-100 px-3 py-2 rounded">
                                                                    <span className="font-semibold text-green-900">{opt.text}</span>
                                                                    <span className="font-bold text-green-800 bg-green-200 px-3 py-1 rounded text-base">{opt.votes ?? 0} votes</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )) : (
                                                <div className="text-center py-12 text-gray-500 text-lg">No polls found.</div>
                                            )}
                                        </div>
                                    </div>
                                );
                
            case 'reports':
                if (isReportLoading) return <div className="text-center p-10 bg-white rounded-xl shadow-lg">Loading Civic Engagement Report...</div>;
                if (!reportsData) return <div className="text-center p-10 text-red-500 bg-white rounded-xl shadow-lg">Could not load report data.</div>;

                const statusSummaryChartData = getStatusSummaryChartData();

                return (
                    <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-extrabold text-green-900">Civic Engagement Report</h2>
                            <button onClick={exportToCSV} className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold shadow">Export as CSV</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-gray-50 p-6 rounded-xl border"><div className="text-gray-600 text-sm">Total Petitions</div><div className="text-3xl font-bold text-green-800">{reportsData.totalPetitions || 0}</div></div>
                            <div className="bg-gray-50 p-6 rounded-xl border"><div className="text-gray-600 text-sm">Petitions Responded</div><div className="text-3xl font-bold text-green-800">{reportsData.respondedCount || 0}</div></div>
                            <div className="bg-gray-50 p-6 rounded-xl border"><div className="text-gray-600 text-sm">Awaiting Response</div><div className="text-3xl font-bold text-orange-600">{reportsData.pendingCount || 0}</div></div>
                            <div className="bg-gray-50 p-6 rounded-xl border"><div className="text-gray-600 text-sm">Avg. Response Time</div><div className="text-3xl font-bold text-blue-800">{reportsData.averageResponseTimeDays || 'N/A'} days</div></div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-green-900 mb-4">Petitions by Status</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-50 p-6 rounded-xl border">
                                <div className="flex flex-wrap gap-6 text-center">
                                    {reportsData.petitionsByStatus && Object.entries(reportsData.petitionsByStatus).map(([status, count]) => (
                                        <div key={status} className="flex-1 min-w-[100px]">
                                            <div className="text-3xl font-bold text-gray-800">{count}</div>
                                            <div className="text-sm text-gray-600 capitalize">{status.replace('-', ' ')}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="max-w-[250px] mx-auto">
                                    <Doughnut 
                                        data={statusSummaryChartData} 
                                        options={{ plugins: { legend: { position: 'top' } } }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* The Engagement Trends section has been removed as requested */}

                    </div>
                );
            default:
                return <div className="text-center p-10">Select a tab to view content.</div>;
        }
    };

    if (!userInfo) {
        return <div className="min-h-screen flex items-center justify-center font-semibold text-lg text-gray-600">Loading Dashboard...</div>;
    }
    
    const firstName = userInfo?.fullName ? userInfo.fullName.split(' ')[0] : 'Official';
    const navigationItems = [
        { id: 'dashboard', icon: '🏠', label: 'Dashboard', badge: null },
        { id: 'petitions', icon: '📝', label: 'Petitions', badge: petitions.filter(p => p.status === 'pending').length },
        { id: 'polls', icon: '📊', label: 'Polls', badge: polls.length },
        { id: 'reports', icon: '📈', label: 'Reports', badge: null },
        { id: 'settings', icon: '⚙️', label: 'Settings', badge: null }
    ];

    return (
        <>
        <ToastModal
  show={toast.show}
  message={toast.message}
  type={toast.type}
  onClose={() => setToast({ ...toast, show: false })}
/>
            <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex">
                <div className="w-80 bg-gradient-to-b from-green-300 to-green-400 p-6 shadow-xl flex flex-col sticky top-0 h-screen overflow-y-auto">
                    <div className="flex items-center mb-8 text-green-800"><div className="text-3xl mr-3">🏛️</div><div className="text-2xl font-bold">CIVIX</div></div>
                    <div className="bg-white bg-opacity-30 rounded-xl p-5 mb-8"><div className="bg-green-800 text-white px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">VERIFIED OFFICIAL</div><div className="text-lg font-bold text-green-800 mb-1">{userInfo.fullName}</div><div className="text-green-700 text-sm mb-2">{userInfo.email}</div></div>
                    <nav className="flex-1">
                        {navigationItems.map((item) => (
                            <div key={item.id} className={`flex items-center p-4 m-2 rounded-lg cursor-pointer transition-all duration-300 text-green-800 font-medium hover:bg-white hover:bg-opacity-40 ${activeTab === item.id ? 'bg-white bg-opacity-50' : ''}`} onClick={() => handleNavClick(item.id)}>
                                <span className="mr-3 text-lg">{item.icon}</span>
                                <span className="flex-1">{item.label}</span>
                                {item.badge > 0 && <span className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">{item.badge}</span>}
                            </div>
                        ))}
                    </nav>
                    <div className="mt-8 pt-5 sticky bottom-0 border-t border-white border-opacity-30"><div className="flex items-center p-2 m-1 rounded-lg cursor-pointer text-black-400 font-medium hover:bg-white hover:bg-opacity-40" onClick={handleSignOutClick}><span className="mr-3 text-lg">🚪</span> Sign Out</div></div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto">
                    <h1 className="text-3xl font-bold mb-6 text-green-800">
                        {activeTab === 'dashboard' ? `Welcome back, ${firstName}!` : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </h1>
                    {renderTabContent()}
                </div>
            </div>

            {/* --- Modals --- */}
            {showSignOutModal && ( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"> <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"> <div className="text-center"> <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4"><span className="text-2xl">🚪</span></div> <h3 className="text-lg font-bold text-gray-900 mb-2">Sign Out</h3> <p className="text-sm text-gray-500 mb-6">Are you sure you want to sign out?</p> </div> <div className="flex gap-3"> <button onClick={cancelSignOut} className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200">Cancel</button> <button onClick={confirmSignOut} className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700">Sign Out</button> </div> </div> </div> )}
            {showResponseModal && selectedPetition && ( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"> <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"> <div className="flex justify-between items-center mb-4"> <h3 className="text-xl font-bold text-green-800">Respond to Petition</h3> <button onClick={closeResponseModal} className="text-gray-500 hover:text-gray-700 text-2xl">×</button> </div> <div className="bg-gray-50 rounded-lg p-4 mb-6"> <h4 className="font-semibold text-green-800 mb-2">{selectedPetition.title}</h4> <p className="text-gray-600 text-sm mb-2">Submitted by: {selectedPetition.creator?.fullName}</p> <p className="text-gray-700">{selectedPetition.description}</p> </div> <div> <div className="mb-4"> <label className="block text-sm font-medium text-gray-700 mb-2">Response Status</label> <select name="responseStatus" value={responseForm.responseStatus} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-lg"> <option value="under-consideration">Under Consideration</option> <option value="approved">Approved</option> <option value="rejected">Rejected</option> </select> </div> <div className="mb-4"> <label className="block text-sm font-medium text-gray-700 mb-2">Response Message *</label> <textarea name="message" value={responseForm.message} onChange={handleFormChange} rows={5} placeholder="Provide a detailed response..." className="w-full p-3 border border-gray-300 rounded-lg" /> </div> <div className="flex gap-3"> <button type="button" onClick={submitResponse} disabled={isSubmitting} className="flex-1 bg-green-800 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-400"> {isSubmitting ? 'Submitting...' : 'Submit Response'} </button> <button type="button" onClick={closeResponseModal} className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600">Cancel</button> </div> </div> </div> </div> )}
                        {showPollModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                    <div className="flex justify-between items-center p-6 border-b">
                                        <h2 className="text-xl font-semibold text-gray-800">{editingPoll ? 'Update Poll' : 'Create a New Poll'}</h2>
                                        <button onClick={() => setShowPollModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Poll Question</label>
                                            <input type="text" value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} placeholder="What do you want to ask?" className="w-full p-2 border rounded-md"/>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea value={pollDescription} onChange={(e) => setPollDescription(e.target.value)} placeholder="Provide more context..." rows={3} className="w-full p-2 border rounded-md"/>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                            <input type="text" value={pollLocation} onChange={(e) => setPollLocation(e.target.value)} placeholder="e.g., San Diego, CA" className="w-full p-2 border rounded-md"/>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Poll Options</label>
                                            {pollOptions.map((option, index) => (
                                                <div key={index} className="flex gap-2 mb-2">
                                                    <input type="text" value={option} onChange={(e) => updatePollOption(index, e.target.value)} placeholder={`Option ${index + 1}`} className="flex-1 p-2 border rounded-md"/>
                                                    {pollOptions.length > 2 && <button onClick={() => removePollOption(index)} className="p-2 text-red-500 font-bold">&times;</button>}
                                                </div>
                                            ))}
                                            {pollOptions.length < 10 && <button onClick={addPollOption} className="text-sm text-green-600 font-semibold">+ Add Option</button>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Closes On</label>
                                            <input type="date" value={closesOn} onChange={(e) => setClosesOn(e.target.value)} className="w-full p-2 border rounded-md"/>
                                        </div>
                                        <div className="flex gap-3 justify-end pt-4">
                                            <button onClick={() => setShowPollModal(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                                            <button onClick={handleSubmitPoll} disabled={isPollSubmitting} className="px-6 py-2 bg-green-800 text-white rounded-md disabled:bg-green-400 hover:bg-green-700">
                                                {isPollSubmitting ? 'Saving...' : editingPoll ? 'Update Poll' : 'Create Poll'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {closePollId && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                                    <div className="text-center">
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                            <span className="text-2xl">🛑</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Close Poll</h3>
                                        <p className="text-sm text-gray-500 mb-6">Are you sure you want to close this poll?</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={cancelClosePoll} className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200">Cancel</button>
                                        <button onClick={confirmClosePoll} className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700">Close Poll</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {showResultsModal && selectedPollResults && ( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"> <div className="bg-white rounded-2xl p-6 max-w-lg w-full"> <div className="flex justify-between items-center mb-4"> <h3 className="text-xl font-bold text-green-800">Poll Results</h3> <button onClick={() => setShowResultsModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button> </div> <div className="mb-4"> <div className="font-semibold text-gray-900 text-lg mb-2">{selectedPollResults.title}</div> <div className="text-sm text-gray-500 mb-4"> Created: {new Date(selectedPollResults.createdAt).toLocaleDateString()} </div> <div className="space-y-3"> {(() => { const mockTotalVotes = 50; const mockOptions = [ { text: "Option A", votes: 20 }, { text: "Option B", votes: 30 }, ]; return Array.isArray(mockOptions) && mockOptions.map((opt, i) => { const percent = mockTotalVotes > 0 ? Math.round(((opt.votes || 0) / mockTotalVotes) * 100) : 0; return ( <div key={i}> <div className="flex justify-between items-center mb-1"> <span className="text-sm font-medium text-gray-700">{opt.text}</span> <span className="text-sm font-bold text-green-800"> {opt.votes} votes ({percent}%) </span> </div> <div className="w-full bg-gray-200 rounded-full h-4"> <div className="bg-green-500 h-4 rounded-full text-xs text-white flex items-center justify-center transition-all duration-500" style={{ width: `${percent}%` }} > {percent > 10 && `${percent}%`} </div> </div> </div> ); }); })()} </div> </div> <div className="flex justify-end mt-6"> <button onClick={() => setShowResultsModal(false)} className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700"> Close </button> </div> </div> </div> )}
        </>
    );
};

export default OfficialDashboard;