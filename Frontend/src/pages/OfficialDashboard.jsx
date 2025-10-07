// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import API from '../api';
// import OfficialSettings from './OfficialSettings';

// // --- CHART.JS IMPORTS ---
// import {
//     ArcElement,
//     BarElement,
//     CategoryScale,
//     Chart as ChartJS,
//     Legend,
//     LinearScale,
//     LineElement,
//     PointElement,
//     Title,
//     Tooltip,
// } from 'chart.js';
// import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     ArcElement,
//     Title,
//     Tooltip,
//     Legend,
//     LineElement,
//     PointElement,
//     BarElement
// );

// // Toast Modal Component
// const ToastModal = ({ message, onClose, show, type = "success" }) => {
//     React.useEffect(() => {
//         if (show) {
//             const timer = setTimeout(onClose, 2500);
//             return () => clearTimeout(timer);
//         }
//     }, [show, onClose]);

//     if (!show) return null;

//     return (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 px-4">
//             <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-auto p-6 flex flex-col items-center">
//                 <div className={`mb-4 text-4xl ${type === "success" ? "text-green-500" : "text-red-500"}`}>
//                     {type === "success" ? "✔️" : "❌"}
//                 </div>
//                 <div className="text-lg font-semibold text-gray-800 mb-2 text-center">{message}</div>
//                 <div className="text-sm text-gray-500 mb-4 text-center">This popup will close automatically.</div>
//                 <button
//                     onClick={onClose}
//                     className={`px-6 py-2 rounded-lg font-semibold w-full sm:w-auto ${
//                         type === "success" ? "bg-green-600 text-white hover:bg-green-700" : "bg-red-600 text-white hover:bg-red-700"
//                     }`}
//                 >
//                     Close Now
//                 </button>
//             </div>
//         </div>
//     );
// };

// // Mobile Navigation Component
// const MobileNav = ({ activeTab, handleNavClick, navigationItems, userInfo, handleSignOutClick, setShowMobileNav }) => {
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
//             <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-green-300 to-green-400 p-6 shadow-xl flex flex-col">
//                 <div className="flex items-center justify-between mb-8">
//                     <div className="flex items-center text-green-800">
//                         <div className="text-3xl mr-3">🏛️</div>
//                         <div className="text-2xl font-bold">CIVIX</div>
//                     </div>
//                     <button 
//                         onClick={() => setShowMobileNav(false)}
//                         className="text-2xl text-green-800 hover:text-green-900"
//                     >
//                         ×
//                     </button>
//                 </div>
//                 <div className="bg-white bg-opacity-30 rounded-xl p-5 mb-8">
//                     <div className="bg-green-800 text-white px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">VERIFIED OFFICIAL</div>
//                     <div className="text-lg font-bold text-green-800 mb-1">{userInfo.fullName}</div>
//                     <div className="text-green-700 text-sm mb-2">{userInfo.email}</div>
//                 </div>
//                 <nav className="flex-1 overflow-y-auto">
//                     {navigationItems.map((item) => (
//                         <div key={item.id} className={`flex items-center p-4 m-2 rounded-lg cursor-pointer transition-all duration-300 text-green-800 font-medium hover:bg-white hover:bg-opacity-40 ${activeTab === item.id ? 'bg-white bg-opacity-50' : ''}`} 
//                              onClick={() => { handleNavClick(item.id); setShowMobileNav(false); }}>
//                             <span className="mr-3 text-lg">{item.icon}</span>
//                             <span className="flex-1">{item.label}</span>
//                             {item.badge > 0 && <span className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">{item.badge}</span>}
//                         </div>
//                     ))}
//                 </nav>
//                 <div className="mt-8 pt-5 border-t border-white border-opacity-30">
//                     <div className="flex items-center p-2 m-1 rounded-lg cursor-pointer text-black-400 font-medium hover:bg-white hover:bg-opacity-40" 
//                          onClick={() => { handleSignOutClick(); setShowMobileNav(false); }}>
//                         <span className="mr-3 text-lg">🚪</span> Sign Out
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Mobile Header Component
// const MobileHeader = ({ userInfo, setShowMobileNav, activeTab, firstName }) => {
//     return (
//         <div className="lg:hidden bg-gradient-to-r from-green-300 to-green-400 p-4 shadow-lg sticky top-0 z-30">
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                     <button 
//                         onClick={() => setShowMobileNav(true)}
//                         className="text-2xl text-green-800 mr-4"
//                     >
//                         ☰
//                     </button>
//                     <div className="flex items-center text-green-800">
//                         <div className="text-2xl mr-2">🏛️</div>
//                         <div className="text-xl font-bold">CIVIX</div>
//                     </div>
//                 </div>
//                 <div className="text-right">
//                     <div className="text-sm font-semibold text-green-800">{firstName}</div>
//                     <div className="text-xs text-green-700">{activeTab}</div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const OfficialDashboard = () => {
//     // --- STATE MANAGEMENT ---
//     const [activeTab, setActiveTab] = useState('dashboard');
//     const [petitions, setPetitions] = useState([]);
//     const [polls, setPolls] = useState([]);
//     const [stats, setStats] = useState({ petitions: 0, polls: 0, responseRate: '0%', civicParticipationRate: '0%' });
//     const [engagement, setEngagement] = useState({ 
//         activeUsers: 0, 
//         civicParticipationRate: '0%', 
//         avgResponseTime: 0 
//     });
//     const [userInfo, setUserInfo] = useState(null);
//     const [showResponseModal, setShowResponseModal] = useState(false);
//     const [selectedPetition, setSelectedPetition] = useState(null);
//     const [responseForm, setResponseForm] = useState({ message: '', responseStatus: 'under-consideration' });
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [showSignOutModal, setShowSignOutModal] = useState(false);
//     const [showPollModal, setShowPollModal] = useState(false);
//     const [isPollSubmitting, setIsPollSubmitting] = useState(false);
//     const [editingPoll, setEditingPoll] = useState(null);
//     const [pollQuestion, setPollQuestion] = useState('');
//     const [pollDescription, setPollDescription] = useState('');
//     const [pollOptions, setPollOptions] = useState(['', '']);
//     const [pollLocation, setPollLocation] = useState('');
//     const [closesOn, setClosesOn] = useState('');
//     const [showResultsModal, setShowResultsModal] = useState(false);
//     const [selectedPollResults, setSelectedPollResults] = useState(null);
//     const [reportsData, setReportsData] = useState(null);
//     const [isReportLoading, setIsReportLoading] = useState(true);
//     const [toast, setToast] = useState({ show: false, message: "", type: "success" });
//     const [closePollId, setClosePollId] = useState(null);
//     const [showMobileNav, setShowMobileNav] = useState(false);

//     const navigate = useNavigate();

//     // --- AUTHENTICATION & DATA LOADING ---
//     useEffect(() => {
//         const storedUser = API.getStoredUser();
//         if (storedUser && storedUser.role === 'official') {
//             setUserInfo(storedUser);
//         } else {
//             navigate('/login');
//         }
//     }, [navigate]);

//     useEffect(() => {
//         if (userInfo) {
//             fetchPetitions();
//             fetchPolls();
//             fetchStats();
//             fetchEngagement();
//             fetchReportsData();
//         }
//     }, [userInfo]);

//     // --- API FETCHING FUNCTIONS ---
//     const fetchPetitions = async () => {
//         try {
//             const response = await API.getPetitions({ limit: 1000 });
//             setPetitions(response.data.petitions || []);
//         } catch (err) {
//             console.error('Failed to fetch petitions:', err);
//             setPetitions([]);
//         }
//     };
//     const fetchPolls = async () => {
//         try {
//             const response = await API.getAllPolls();
//             setPolls(response.data || []);
//         } catch (err) {
//             console.error('Failed to fetch polls:', err);
//             setPolls([]);
//         }
//     };
//     const fetchStats = async () => {
//         try {
//             const response = await API.getDashboardSummary();
//             setStats(response.data);
//         } catch (err) {
//             console.error('Failed to fetch stats:', err);
//         }
//     };
//     const fetchEngagement = async () => {
//         try {
//             const response = await API.getDashboardEngagement();
//             setEngagement(response.data);
//         } catch (err) {
//             console.error('Failed to fetch engagement data:', err);
//         }
//     };
//     const fetchReportsData = async () => {
//         setIsReportLoading(true);
//         try {
//             const response = await API.getReportsData();
//             setReportsData(response.data);
//         } catch (err) {
//             console.error('Failed to fetch reports data:', err);
//             setReportsData(null);
//         } finally {
//             setIsReportLoading(false);
//         }
//     };
    
//     // --- HANDLERS ---
//     const handleNavClick = (tab) => setActiveTab(tab);
//     const handleSignOutClick = () => setShowSignOutModal(true);
//     const confirmSignOut = () => {
//         API.clearAuth();
//         localStorage.removeItem('user');
//         navigate('/');
//     };
//     const cancelSignOut = () => setShowSignOutModal(false);
//     const respondToPetition = (petition) => {
//         setSelectedPetition(petition);
//         setShowResponseModal(true);
//         setResponseForm({ message: '', responseStatus: 'under-consideration' });
//     };
//     const closeResponseModal = () => {
//         setShowResponseModal(false);
//         setSelectedPetition(null);
//     };
//     const handleFormChange = (e) => setResponseForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
//     const submitResponse = async () => {
//         if (!selectedPetition || !responseForm.message.trim()) {
//             setToast({ show: true, message: "Please fill in the response message", type: "error" });
//             return;
//         }
//         setIsSubmitting(true);
//         try {
//             await API.respondToPetition(selectedPetition._id, {
//                 ...responseForm,
//                 respondedBy: userInfo?.fullName || 'Public Official'
//             });
//             setToast({ show: true, message: "Response submitted successfully!", type: "success" });
//             closeResponseModal();
//             fetchPetitions();
//             fetchStats();
//         } catch (error) {
//             console.error('Error submitting response:', error);
//             setToast({ show: true, message: "Failed to submit response. Please try again.", type: "error" });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
//     const addPollOption = () => setPollOptions([...pollOptions, '']);
//     const updatePollOption = (index, value) => {
//         const newOptions = [...pollOptions];
//         newOptions[index] = value;
//         setPollOptions(newOptions);
//     };
//     const removePollOption = (index) => {
//         if (pollOptions.length > 2) setPollOptions(pollOptions.filter((_, i) => i !== index));
//     };
//     const handleSubmitPoll = async () => {
//         if (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim()) || !pollLocation.trim()) {
//             setToast({ show: true, message: "Please fill all poll fields.", type: "error" });
//             return;
//         }
//         setIsPollSubmitting(true);
//         try {
//             const pollData = {
//                 title: pollQuestion,
//                 description: pollDescription,
//                 options: pollOptions.map(opt => ({ text: opt, votes: 0 })),
//                 targetLocation: pollLocation,
//                 createdBy: userInfo._id,
//                 closeDate: closesOn,
//                 isOfficial: true,
//             };
//             if (editingPoll) {
//                 await API.updatePoll(editingPoll._id, pollData);
//                 setToast({ show: true, message: "Poll updated successfully! 🎉", type: "success" });
//             } else {
//                 await API.createPoll(pollData);
//                 setToast({ show: true, message: "Poll created successfully! 🎉", type: "success" });
//             }
//             setTimeout(() => {
//                 setShowPollModal(false);
//                 setEditingPoll(null);
//                 fetchPolls();
//                 setPollQuestion('');
//                 setPollDescription('');
//                 setPollOptions(['', '']);
//                 setPollLocation('');
//                 setClosesOn('');
//             }, 500);
//         } catch (err) {
//             setToast({ show: true, message: "Error saving poll.", type: "error" });
//         } finally {
//             setIsPollSubmitting(false);
//         }
//     };
//     const viewResults = async (pollId) => {
//         try {
//             const response = await API.getPollResults(pollId);
//             setSelectedPollResults({
//                 title: response.data.question,
//                 options: response.data.options,
//                 createdAt: new Date().toISOString(),
//             });
//             setShowResultsModal(true);
//         } catch (err) {
//             setToast({ show: true, message: "Failed to fetch poll results", type: "error" });
//         }
//     };
//     const handleDeletePoll = (pollId) => {
//         setClosePollId(pollId);
//     };
//     const confirmClosePoll = async () => {
//         if (!closePollId) return;
//         try {
//             await API.deletePoll(closePollId);
//             setToast({ show: true, message: 'Poll closed successfully!', type: 'success' });
//             setClosePollId(null);
//             fetchPolls();
//         } catch (err) {
//             setToast({ show: true, message: 'Error closing poll.', type: 'error' });
//             setClosePollId(null);
//         }
//     };
//     const cancelClosePoll = () => setClosePollId(null);

//     // --- CHART DATA CALCULATIONS ---
//     const engagementChartData = useMemo(() => {
//         const labels = Array.from({ length: 30 }).map((_, i) => {
//             const date = new Date();
//             date.setDate(date.getDate() - (29 - i));
//             return date.toLocaleDateString('en-CA');
//         });

//         const petitionCounts = new Array(30).fill(0);
//         const signatureCounts = new Array(30).fill(0);
//         const thirtyDaysAgo = new Date();
//         thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//         petitions.forEach(p => {
//             const createdAt = new Date(p.createdAt);
//             if (createdAt >= thirtyDaysAgo) {
//                 const diffTime = new Date().setHours(0,0,0,0) - new Date(createdAt).setHours(0,0,0,0);
//                 const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
//                 if (diffDays >= 0 && diffDays < 30) {
//                     petitionCounts[29 - diffDays]++;
//                 }
//             }
//             p.signatures?.forEach(sig => {
//                 if (sig.signedAt) {
//                     const signedAt = new Date(sig.signedAt);
//                     if (signedAt >= thirtyDaysAgo) {
//                         const sigDiffTime = new Date().setHours(0,0,0,0) - new Date(signedAt).setHours(0,0,0,0);
//                         const sigDiffDays = Math.floor(sigDiffTime / (1000 * 60 * 60 * 24));
//                         if (sigDiffDays >= 0 && sigDiffDays < 30) {
//                             signatureCounts[29 - sigDiffDays]++;
//                         }
//                     }
//                 }
//             });
//         });

//         const displayLabels = labels.map(l => new Date(l).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
//         return {
//             labels: displayLabels,
//             datasets: [
//                 {
//                     label: 'New Signatures', data: signatureCounts,
//                     borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)', tension: 0.2,
//                 },
//                 {
//                     label: 'New Petitions', data: petitionCounts,
//                     borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)', tension: 0.2,
//                 }
//             ],
//         };
//     }, [petitions]);

//     const responseTimeChartData = useMemo(() => {
//         const respondedPetitions = petitions.filter(p =>
//             ['responded', 'approved', 'rejected'].includes(p.status) && p.respondedAt
//         );
//         const timeByCategory = respondedPetitions.reduce((acc, p) => {
//             const category = p.category || 'Uncategorized';
//             const createdAt = new Date(p.createdAt);
//             const respondedAt = new Date(p.respondedAt);
//             if (!respondedAt || respondedAt < createdAt) return acc;
//             const diffTime = Math.abs(respondedAt - createdAt);
//             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//             if (!acc[category]) acc[category] = { totalDays: 0, count: 0 };
//             acc[category].totalDays += diffDays;
//             acc[category].count++;
//             return acc;
//         }, {});
//         const labels = Object.keys(timeByCategory);
//         const data = labels.map(cat => (timeByCategory[cat].totalDays / timeByCategory[cat].count).toFixed(1));
//         return {
//             labels,
//             datasets: [{
//                 label: 'Average Response Time (Days)', data,
//                 backgroundColor: 'rgba(54, 162, 235, 0.6)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1,
//             }]
//         };
//     }, [petitions]);

//     // --- RENDER LOGIC ---
//     const getStatusConfig = (status) => {
//         const configs = {
//             'pending': { class: 'bg-yellow-100 text-yellow-700', text: 'Pending Review' },
//             'under-consideration': { class: 'bg-blue-100 text-blue-700', text: 'Under Consideration' },
//             'approved': { class: 'bg-green-100 text-green-700', text: 'Approved' },
//             'rejected': { class: 'bg-red-100 text-red-700', text: 'Rejected' },
//             'active': { class: 'bg-green-100 text-green-700', text: 'Active' },
//             'responded': { class: 'bg-indigo-100 text-indigo-700', text: 'Responded' },
//         };
//         return configs[status] || configs['pending'];
//     };

//     const renderTabContent = () => {
//         switch (activeTab) {
//             case 'dashboard':
//                 return (
//                     <>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
//                             <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border-l-4 border-green-400">
//                                 <div className="text-gray-600 text-sm md:text-base">Total Petitions</div>
//                                 <div className="text-xl md:text-2xl lg:text-3xl font-bold text-green-800">{stats.petitions}</div>
//                             </div>
//                             <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border-l-4 border-blue-400">
//                                 <div className="text-gray-600 text-sm md:text-base">Total Active Polls</div>
//                                 <div className="text-xl md:text-2xl lg:text-3xl font-bold text-green-800">{polls.length}</div>
//                             </div>
//                             <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border-l-4 border-purple-400">
//                                 <div className="text-gray-600 text-sm md:text-base">Response Rate</div>
//                                 <div className="text-xl md:text-2xl lg:text-3xl font-bold text-green-800">{stats.responseRate}</div>
//                             </div>
//                             <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border-l-4 border-orange-400">
//                                 <div className="text-gray-600 text-sm md:text-base">Civic Participation Rate</div>
//                                 <div className="text-xl md:text-2xl lg:text-3xl font-bold text-green-800">{stats.civicParticipationRate}</div>
//                             </div>
//                         </div>
                        
//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
//                             <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg lg:col-span-2">
//                                 <h2 className="text-lg md:text-xl font-bold text-green-800 mb-4">Recent Petitions</h2>
//                                 <div className="space-y-3">
//                                     {petitions.slice(0, 5).map(p => (
//                                         <div key={p._id} className="flex flex-col sm:flex-row sm:justify-between sm:items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                                             <div className="mb-2 sm:mb-0 flex-1">
//                                                 <p className="font-medium text-green-800 text-sm md:text-base mb-1">{p.title}</p>
//                                                 <p className="text-xs text-gray-500">{p.signatures?.length || 0} signatures</p>
//                                             </div>
//                                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusConfig(p.status).class} self-start sm:self-auto`}>
//                                                 {getStatusConfig(p.status).text}
//                                             </span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
//                                 <h2 className="text-lg md:text-xl font-bold text-green-800 mb-4 md:mb-6">Community Engagement</h2>
//                                 <div className="space-y-3 md:space-y-4">
//                                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                                         <span className="text-gray-600 font-medium text-sm md:text-base">Active Users (7d)</span>
//                                         <span className="text-lg md:text-xl font-bold text-green-800">{engagement.activeUsers}</span>
//                                     </div>
//                                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                                         <span className="text-gray-600 font-medium text-sm md:text-base">Civic Participation</span>
//                                         <span className="text-lg md:text-xl font-bold text-green-800">{engagement.civicParticipationRate}</span>
//                                     </div>
//                                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                                         <span className="text-gray-600 font-medium text-sm md:text-base">Avg. Response Time</span>
//                                         <span className="text-lg md:text-xl font-bold text-green-800">{engagement.avgResponseTime} <span className="text-xs">days</span></span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </>
//                 );
//             case 'petitions':
//                 return (
//                     <div className="space-y-4 md:space-y-6">
//                         <div className="bg-gradient-to-b from-green-300 to-green-400 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg text-green-800">
//                             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                                 <div className="flex-1">
//                                     <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">📋 Petitions Management</h2>
//                                     <p className="text-white text-sm md:text-base">Review and respond to community petitions</p>
//                                 </div>
//                                 <div className="text-right">
//                                     <div className="bg-white bg-opacity-20 rounded-lg md:rounded-xl p-3 md:p-4">
//                                         <div className="text-lg md:text-xl lg:text-2xl font-bold">{petitions.length}</div>
//                                         <div className="text-xs md:text-sm text-green-800">Total Petitions</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="space-y-4">
//                             {petitions.length > 0 ? petitions.map((p) => {
//                                 const isResponded = ['responded', 'approved', 'rejected'].includes(p.status);
//                                 return (
//                                     <div key={p._id} className="bg-white rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200">
//                                         <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
//                                             <div className="flex-1">
//                                                 <div className="flex items-start gap-3 md:gap-4 mb-4">
//                                                     <div className="bg-green-100 rounded-full p-2 md:p-3 flex-shrink-0">
//                                                         <div className="text-green-600 text-lg md:text-xl">📄</div>
//                                                     </div>
//                                                     <div className="flex-1 min-w-0">
//                                                         <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-2 truncate">{p.title}</h3>
//                                                         <p className="text-gray-600 leading-relaxed line-clamp-2 text-sm md:text-base">{p.description}</p>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
//                                                     <div className="flex items-center gap-1 md:gap-2">
//                                                         <div className="bg-blue-50 rounded-full p-1"><div className="text-blue-600 text-xs">👤</div></div>
//                                                         <span className="text-xs text-gray-600"><span className="font-medium">By:</span> {p.creator?.fullName || 'Anonymous'}</span>
//                                                     </div>
//                                                     <div className="flex items-center gap-1 md:gap-2">
//                                                         <div className="bg-purple-50 rounded-full p-1"><div className="text-purple-600 text-xs">✍️</div></div>
//                                                         <span className="text-xs text-gray-600"><span className="font-medium">{p.signatures?.length || 0}</span> signatures</span>
//                                                     </div>
//                                                     <div className="flex items-center gap-1 md:gap-2">
//                                                         <div className="bg-gray-50 rounded-full p-1"><div className="text-gray-600 text-xs">📅</div></div>
//                                                         <span className="text-xs text-gray-600">{new Date(p.createdAt).toLocaleDateString()}</span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex items-center justify-between">
//                                                     <span className={`inline-flex items-center px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-semibold ${getStatusConfig(p.status).class}`}>
//                                                         <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></div>
//                                                         {getStatusConfig(p.status).text}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                             <div className="flex flex-col gap-2 sm:flex-row lg:flex-col sm:justify-end">
//                                                 <button
//                                                     onClick={() => respondToPetition(p)}
//                                                     disabled={isResponded}
//                                                     className={`px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs font-semibold transition-all duration-200 min-w-[100px] ${
//                                                         isResponded
//                                                             ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                                             : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
//                                                         }`}
//                                                 >
//                                                     {isResponded ? '✅ Responded' : '💬 Respond'}
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             }) : (
//                                 <div className="text-center py-8 md:py-12 bg-white rounded-xl shadow-lg">
//                                     <div className="text-4xl md:text-6xl mb-4">📭</div>
//                                     <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">No Petitions Found</h3>
//                                     <p className="text-gray-500 text-sm md:text-base">There are currently no petitions to review.</p>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 );
//             case 'polls':
//                 return (
//                     <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg">
//                         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
//                             <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-green-900">Polls Management</h2>
//                             <button
//                                 onClick={() => {
//                                     setEditingPoll(null);
//                                     setPollQuestion('');
//                                     setPollDescription('');
//                                     setPollOptions(['', '']);
//                                     setPollLocation('');
//                                     setClosesOn('');
//                                     setShowPollModal(true);
//                                 }}
//                                 className="bg-green-800 text-white px-4 py-2 md:px-5 md:py-3 rounded-lg hover:bg-green-700 font-semibold shadow text-sm md:text-base w-full md:w-auto"
//                             >
//                                 ＋ Create New Poll
//                             </button>
//                         </div>
//                         <div className="space-y-4">
//                             {polls.length > 0 ? polls.map((poll) => (
//                                 <div key={poll._id} className="bg-gray-50 p-4 md:p-6 rounded-lg border-2 border-green-500 shadow-sm">
//                                     <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
//                                         <h3 className="text-base md:text-lg lg:text-xl font-bold text-green-900 truncate">{poll.title}</h3>
//                                         {poll.isOfficial && (
//                                             <span className="px-2 py-1 bg-yellow-300 text-yellow-900 rounded-full text-xs font-bold flex items-center gap-1 self-start md:self-auto">
//                                                 <span>★</span> Official Poll
//                                             </span>
//                                         )}
//                                     </div>
//                                     <div className="text-xs md:text-sm text-gray-600 mb-2">
//                                         Location: <span className="font-semibold">{poll.targetLocation}</span>
//                                     </div>
//                                     <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2">
//                                         <p className="text-xs md:text-sm text-gray-600">Created: {new Date(poll.createdAt).toLocaleDateString()}</p>
//                                         <div className="flex gap-2 flex-wrap">
//                                             {poll.createdBy === userInfo._id && (
//                                                 <button
//                                                     onClick={() => {
//                                                         setEditingPoll(poll);
//                                                         setPollQuestion(poll.title);
//                                                         setPollDescription(poll.description);
//                                                         setPollOptions(poll.options.map(o => o.text));
//                                                         setPollLocation(poll.targetLocation);
//                                                         setClosesOn(poll.closeDate?.slice(0, 10) || '');
//                                                         setShowPollModal(true);
//                                                     }}
//                                                     className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow hover:bg-yellow-600 transition-all duration-150"
//                                                 >
//                                                     ✏️ Edit
//                                                 </button>
//                                             )}
//                                             <button
//                                                 onClick={() => handleDeletePoll(poll._id)}
//                                                 className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow border-2 border-red-800 flex items-center gap-1 hover:bg-red-700 transition-all duration-150"
//                                                 title="Close this poll"
//                                             >
//                                                 <span role="img" aria-label="close">🛑</span>
//                                                 Close
//                                             </button>
//                                         </div>
//                                     </div>
//                                     {poll.description && (
//                                         <p className="text-gray-700 mb-3 text-sm md:text-base line-clamp-2">{poll.description}</p>
//                                     )}
//                                     {poll.options && (
//                                         <div className="space-y-2 mt-2">
//                                             {poll.options.map((opt, idx) => (
//                                                 <div key={idx} className="flex justify-between items-center bg-green-100 px-2 py-1.5 md:px-3 md:py-2 rounded">
//                                                     <span className="font-semibold text-green-900 text-xs md:text-sm truncate">{opt.text}</span>
//                                                     <span className="font-bold text-green-800 bg-green-200 px-2 py-1 rounded text-xs">{opt.votes ?? 0} votes</span>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             )) : (
//                                 <div className="text-center py-8 md:py-12 text-gray-500 text-base md:text-lg">No polls found.</div>
//                             )}
//                         </div>
//                     </div>
//                 );
//             case 'reports':
//                 if (isReportLoading) return <div className="text-center p-6 md:p-10 bg-white rounded-xl shadow-lg">Loading Report...</div>;
//                 if (!reportsData) return <div className="text-center p-6 md:p-10 text-red-500 bg-white rounded-xl shadow-lg">Could not load report data.</div>;
                
//                 const statusChartData = { labels: ['Responded', 'Awaiting Response'], datasets: [{ data: [reportsData.respondedCount, reportsData.pendingCount], backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(249, 115, 22, 0.8)'], borderWidth: 2, borderColor: ['rgba(34, 197, 94, 1)', 'rgba(249, 115, 22, 1)'] }] };
                
//                 const petitionsByCategory = petitions.reduce((acc, petition) => {
//                     const category = petition.category || 'Uncategorized';
//                     acc[category] = (acc[category] || 0) + 1;
//                     return acc;
//                 }, {});

//                 const categoryChartData = {
//                     labels: Object.keys(petitionsByCategory),
//                     datasets: [
//                         {
//                             label: 'Petitions',
//                             data: Object.values(petitionsByCategory),
//                             backgroundColor: ['#4BC0C0', '#36A2EB', '#FFCE56', '#9966FF', '#FF6384', '#FF9F40'],
//                             borderColor: '#FFFFFF',
//                             borderWidth: 2,
//                         },
//                     ],
//                 };
                
//                 return (
//                     <div className="space-y-6 md:space-y-8 lg:space-y-10">
//                         {/* Enhanced Header Section */}
//                         <div className="bg-gradient-to-r from-green-300 via-green-400 to-green-500 rounded-xl md:rounded-2xl lg:rounded-3xl p-6 md:p-8 lg:p-10 shadow-lg text-green-800">
//                             <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6">
//                                 <div className="flex items-center gap-3 md:gap-4">
//                                     <div className="bg-white bg-opacity-25 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4">
//                                         <div className="text-2xl md:text-3xl lg:text-4xl">📊</div>
//                                     </div>
//                                     <div>
//                                         <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Analytics Dashboard</h2>
//                                         <p className="text-green-700 text-sm md:text-base lg:text-lg">Comprehensive civic engagement insights</p>
//                                     </div>
//                                 </div>
//                                 <div className="text-center lg:text-right">
//                                     <div className="bg-white bg-opacity-25 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 min-w-[120px] md:min-w-[160px]">
//                                         <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">{((reportsData.respondedCount / (reportsData.totalPetitions || 1)) * 100).toFixed(0)}%</div>
//                                         <div className="text-xs md:text-sm text-green-700 font-semibold">Overall Response Rate</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Enhanced Stats Cards Grid */}
//                         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
//                             <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
//                                 <div className="flex items-center justify-between mb-4 md:mb-6">
//                                     <div className="bg-blue-100 rounded-xl md:rounded-2xl p-3 md:p-4 group-hover:scale-110 transition-transform duration-300"><div className="text-blue-600 text-xl md:text-2xl lg:text-3xl">📋</div></div>
//                                     <div className="text-right"><div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total</div><div className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600">{reportsData.totalPetitions || 0}</div></div>
//                                 </div>
//                                 <h3 className="text-gray-800 font-bold text-base md:text-lg mb-2">Total Petitions</h3>
//                                 <p className="text-xs md:text-sm text-gray-600">All submitted community requests</p>
//                                 <div className="mt-3 md:mt-4 h-1 bg-blue-100 rounded-full"><div className="h-1 bg-blue-500 rounded-full w-full"></div></div>
//                             </div>
//                             <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
//                                 <div className="flex items-center justify-between mb-4 md:mb-6">
//                                     <div className="bg-green-100 rounded-xl md:rounded-2xl p-3 md:p-4 group-hover:scale-110 transition-transform duration-300"><div className="text-green-600 text-xl md:text-2xl lg:text-3xl">✅</div></div>
//                                     <div className="text-right"><div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Completed</div><div className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-600">{reportsData.respondedCount || 0}</div></div>
//                                 </div>
//                                 <h3 className="text-gray-800 font-bold text-base md:text-lg mb-2">Responded</h3>
//                                 <p className="text-xs md:text-sm text-gray-600">Successfully addressed petitions</p>
//                                 <div className="mt-3 md:mt-4 h-1 bg-green-100 rounded-full"><div className="h-1 bg-green-500 rounded-full" style={{width: `${(reportsData.respondedCount / (reportsData.totalPetitions || 1)) * 100}%`}}></div></div>
//                             </div>
//                             <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
//                                 <div className="flex items-center justify-between mb-4 md:mb-6">
//                                     <div className="bg-orange-100 rounded-xl md:rounded-2xl p-3 md:p-4 group-hover:scale-110 transition-transform duration-300"><div className="text-orange-600 text-xl md:text-2xl lg:text-3xl">⏳</div></div>
//                                     <div className="text-right"><div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Pending</div><div className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-600">{reportsData.pendingCount || 0}</div></div>
//                                 </div>
//                                 <h3 className="text-gray-800 font-bold text-base md:text-lg mb-2">Awaiting Response</h3>
//                                 <p className="text-xs md:text-sm text-gray-600">Requires immediate attention</p>
//                                 <div className="mt-3 md:mt-4 h-1 bg-orange-100 rounded-full"><div className="h-1 bg-orange-500 rounded-full" style={{width: `${(reportsData.pendingCount / (reportsData.totalPetitions || 1)) * 100}%`}}></div></div>
//                             </div>
//                             <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
//                                 <div className="flex items-center justify-between mb-4 md:mb-6">
//                                     <div className="bg-purple-100 rounded-xl md:rounded-2xl p-3 md:p-4 group-hover:scale-110 transition-transform duration-300"><div className="text-purple-600 text-xl md:text-2xl lg:text-3xl">⚡</div></div>
//                                     <div className="text-right"><div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Average</div><div className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-600">{reportsData.averageResponseTimeDays || 'N/A'}</div></div>
//                                 </div>
//                                 <h3 className="text-gray-800 font-bold text-base md:text-lg mb-2">Response Time</h3>
//                                 <p className="text-xs md:text-sm text-gray-600">Days to provide response</p>
//                                 <div className="mt-3 md:mt-4 h-1 bg-purple-100 rounded-full"><div className="h-1 bg-purple-500 rounded-full w-3/4"></div></div>
//                             </div>
//                         </div>

//                         {/* Pie Charts Section */}
//                         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
//                             <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl p-6 md:p-8 lg:p-10 shadow-lg border border-gray-100">
//                                 <div className="text-center mb-6 md:mb-8 lg:mb-10"><h3 className="text-xl md:text-2xl font-bold text-gray-800">Response Status Distribution</h3><p className="text-gray-600 text-sm md:text-base">Breakdown of petition response status</p></div>
//                                 <div className="w-full h-64 md:h-72 lg:h-80"><Doughnut data={statusChartData} options={{ cutout: '65%', responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }}}} /></div>
//                             </div>
//                             {categoryChartData.labels.length > 0 && (
//                                 <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl p-6 md:p-8 lg:p-10 shadow-lg border border-gray-100">
//                                     <div className="text-center mb-6 md:mb-8 lg:mb-10"><h3 className="text-xl md:text-2xl font-bold text-gray-800">Petitions by Category</h3><p className="text-gray-600 text-sm md:text-base">Distribution across categories</p></div>
//                                     <div className="w-full h-64 md:h-72 lg:h-80"><Pie data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }}}} /></div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Engagement and Responsiveness Charts */}
//                         <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl p-6 md:p-8 lg:p-10 shadow-lg border border-gray-100">
//                            <div className="text-center mb-6 md:mb-8">
//                                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Engagement Over Time</h3>
//                                <p className="text-gray-600 text-sm md:text-base">New petitions and signatures over the last 30 days.</p>
//                            </div>
//                            <div className="h-64 md:h-72 lg:h-80">
//                                <Line data={engagementChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />
//                            </div>
//                         </div>

//                         {responseTimeChartData.labels.length > 0 && (
//                            <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl p-6 md:p-8 lg:p-10 shadow-lg border border-gray-100">
//                                <div className="text-center mb-6 md:mb-8">
//                                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Official Responsiveness by Category</h3>
//                                    <p className="text-gray-600 text-sm md:text-base">Average time to respond to petitions, grouped by category.</p>
//                                </div>
//                                <div className="h-64 md:h-72 lg:h-80">
//                                    <Bar data={responseTimeChartData} options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
//                                </div>
//                            </div>
//                         )}

//                         {/* Performance Insights Section */}
//                         <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-xl md:rounded-2xl lg:rounded-3xl p-6 md:p-8 lg:p-10 shadow-lg border border-gray-200">
//                             <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
//                                 <div className="bg-indigo-100 rounded-xl md:rounded-2xl p-3 md:p-4">
//                                     <div className="text-indigo-600 text-xl md:text-2xl lg:text-3xl">💡</div>
//                                 </div>
//                                 <div>
//                                     <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Performance Insights</h3>
//                                     <p className="text-gray-600 text-sm md:text-base">Key metrics and operational efficiency analysis</p>
//                                 </div>
//                             </div>
                            
//                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
//                                 <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg border border-gray-100">
//                                     <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
//                                         <div className="bg-blue-100 rounded-lg md:rounded-xl p-2">
//                                             <div className="text-blue-600 text-lg md:text-xl">⚡</div>
//                                         </div>
//                                         <h4 className="font-bold text-gray-800 text-lg md:text-xl">Response Efficiency</h4>
//                                     </div>
//                                     <div className="space-y-4 md:space-y-6">
//                                         <div>
//                                             <div className="flex justify-between mb-2 md:mb-3">
//                                                 <span className="text-sm text-gray-700 font-medium">Overall Response Rate</span>
//                                                 <span className="font-bold text-indigo-600 text-base md:text-lg">{((reportsData.respondedCount / (reportsData.totalPetitions || 1)) * 100).toFixed(1)}%</span>
//                                             </div>
//                                             <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 shadow-inner">
//                                                 <div 
//                                                     className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 md:h-3 rounded-full transition-all duration-1000 shadow-sm" 
//                                                     style={{width: `${(reportsData.respondedCount / (reportsData.totalPetitions || 1)) * 100}%`}}
//                                                 ></div>
//                                             </div>
//                                         </div>
//                                         <div className="pt-3 md:pt-4 border-t border-gray-100">
//                                             <div className="text-xs md:text-sm text-gray-600">
//                                                 <span className="font-semibold text-gray-800">Target:</span> 80% response rate
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
                                
//                                 <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg border border-gray-100">
//                                     <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
//                                         <div className="bg-emerald-100 rounded-lg md:rounded-xl p-2">
//                                             <div className="text-emerald-600 text-lg md:text-xl">👥</div>
//                                         </div>
//                                         <h4 className="font-bold text-gray-800 text-lg md:text-xl">Community Engagement</h4>
//                                     </div>
//                                     <div className="space-y-3 md:space-y-4">
//                                         <div className="flex items-center justify-between p-3 md:p-4 bg-blue-50 rounded-lg md:rounded-xl">
//                                             <span className="text-sm text-gray-700 font-medium">Active Petitions</span>
//                                             <span className="bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs font-bold">{reportsData.pendingCount}</span>
//                                         </div>
//                                         <div className="flex items-center justify-between p-3 md:p-4 bg-emerald-50 rounded-lg md:rounded-xl">
//                                             <span className="text-sm text-gray-700 font-medium">Resolved Issues</span>
//                                             <span className="bg-emerald-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs font-bold">{reportsData.respondedCount}</span>
//                                         </div>
//                                         <div className="flex items-center justify-between p-3 md:p-4 bg-purple-50 rounded-lg md:rounded-xl">
//                                             <span className="text-sm text-gray-700 font-medium">Avg. Response Time</span>
//                                             <span className="bg-purple-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs font-bold">{reportsData.averageResponseTimeDays || 'N/A'} days</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             case 'settings':
//                 return <OfficialSettings />;

//             default: return <div>Select a tab</div>;
//         }
//     };

//     if (!userInfo) {
//         return <div className="min-h-screen flex items-center justify-center font-semibold text-lg text-gray-600">Loading Dashboard...</div>;
//     }
    
//     const firstName = userInfo?.fullName ? userInfo.fullName.split(' ')[0] : 'Official';
//     const navigationItems = [
//         { id: 'dashboard', icon: '🏠', label: 'Dashboard', badge: null },
//         { id: 'petitions', icon: '📝', label: 'Petitions', badge: petitions.filter(p => p.status === 'pending').length },
//         { id: 'polls', icon: '📊', label: 'Polls', badge: polls.length },
//         { id: 'reports', icon: '📈', label: 'Reports', badge: null },
//         { id: 'settings', icon: '⚙️', label: 'Settings', badge: null }
//     ];

//     return (
//         <>
//             <ToastModal
//                 show={toast.show}
//                 message={toast.message}
//                 type={toast.type}
//                 onClose={() => setToast({ ...toast, show: false })}
//             />
            
//             {/* Mobile Header */}
//             <MobileHeader 
//                 userInfo={userInfo}
//                 setShowMobileNav={setShowMobileNav}
//                 activeTab={activeTab}
//                 firstName={firstName}
//             />

//             {/* Mobile Navigation */}
//             {showMobileNav && (
//                 <MobileNav
//                     activeTab={activeTab}
//                     handleNavClick={handleNavClick}
//                     navigationItems={navigationItems}
//                     userInfo={userInfo}
//                     handleSignOutClick={handleSignOutClick}
//                     setShowMobileNav={setShowMobileNav}
//                 />
//             )}

//             <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex flex-col lg:flex-row">
//                 {/* Desktop Sidebar - Hidden on mobile */}
//                 <div className="hidden lg:flex lg:w-80 bg-gradient-to-b from-green-300 to-green-400 p-6 shadow-xl flex-col sticky top-0 h-screen">
//                     <div className="flex items-center mb-8 text-green-800">
//                         <div className="text-3xl mr-3">🏛️</div>
//                         <div className="text-2xl font-bold">CIVIX</div>
//                     </div>
//                     <div className="bg-white bg-opacity-30 rounded-xl p-5 mb-8">
//                         <div className="bg-green-800 text-white px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">VERIFIED OFFICIAL</div>
//                         <div className="text-lg font-bold text-green-800 mb-1">{userInfo.fullName}</div>
//                         <div className="text-green-700 text-sm mb-2">{userInfo.email}</div>
//                     </div>
//                     <nav className="flex-1">
//                         {navigationItems.map((item) => (
//                             <div key={item.id} className={`flex items-center p-4 m-2 rounded-lg cursor-pointer transition-all duration-300 text-green-800 font-medium hover:bg-white hover:bg-opacity-40 ${activeTab === item.id ? 'bg-white bg-opacity-50' : ''}`} onClick={() => handleNavClick(item.id)}>
//                                 <span className="mr-3 text-lg">{item.icon}</span>
//                                 <span className="flex-1">{item.label}</span>
//                                 {item.badge > 0 && <span className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">{item.badge}</span>}
//                             </div>
//                         ))}
//                     </nav>
//                     <div className="mt-8 pt-5 sticky bottom-0 border-t border-white border-opacity-30">
//                         <div className="flex items-center p-2 m-1 rounded-lg cursor-pointer text-black-400 font-medium hover:bg-white hover:bg-opacity-40" onClick={handleSignOutClick}>
//                             <span className="mr-3 text-lg">🚪</span> Sign Out
//                         </div>
//                     </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
//                     <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-green-800">
//                         {activeTab === 'dashboard' 
//                             ? `Welcome back, ${firstName}!` 
//                             : activeTab === 'settings' 
//                             ? '' 
//                             : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
//                         }
//                     </h1>
//                     {renderTabContent()}
//                 </div>
//             </div>

//             {/* --- Modals --- */}
//             {showSignOutModal && ( 
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 max-w-md w-full mx-4">
//                         <div className="text-center">
//                             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
//                                 <span className="text-2xl">🚪</span>
//                             </div>
//                             <h3 className="text-lg font-bold text-gray-900 mb-2">Sign Out</h3>
//                             <p className="text-sm text-gray-500 mb-6">Are you sure you want to sign out?</p>
//                         </div>
//                         <div className="flex flex-col sm:flex-row gap-3">
//                             <button onClick={cancelSignOut} className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200">Cancel</button>
//                             <button onClick={confirmSignOut} className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700">Sign Out</button>
//                         </div>
//                     </div>
//                 </div> 
//             )}
            
//             {showResponseModal && selectedPetition && ( 
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-lg md:text-xl font-bold text-green-800">Respond to Petition</h3>
//                             <button onClick={closeResponseModal} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
//                         </div>
//                         <div className="bg-gray-50 rounded-lg p-4 mb-6">
//                             <h4 className="font-semibold text-green-800 mb-2">{selectedPetition.title}</h4>
//                             <p className="text-gray-600 text-sm mb-2">Submitted by: {selectedPetition.creator?.fullName}</p>
//                             <p className="text-gray-700">{selectedPetition.description}</p>
//                         </div>
//                         <div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">Response Status</label>
//                                 <select name="responseStatus" value={responseForm.responseStatus} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-lg">
//                                     <option value="under-consideration">Under Consideration</option>
//                                     <option value="approved">Approved</option>
//                                     <option value="rejected">Rejected</option>
//                                 </select>
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">Response Message *</label>
//                                 <textarea name="message" value={responseForm.message} onChange={handleFormChange} rows={5} placeholder="Provide a detailed response..." className="w-full p-3 border border-gray-300 rounded-lg" />
//                             </div>
//                             <div className="flex flex-col sm:flex-row gap-3">
//                                 <button type="button" onClick={submitResponse} disabled={isSubmitting} className="flex-1 bg-green-800 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-400">
//                                     {isSubmitting ? 'Submitting...' : 'Submit Response'}
//                                 </button>
//                                 <button type="button" onClick={closeResponseModal} className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600">Cancel</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div> 
//             )}
            
//             {showPollModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//                         <div className="flex justify-between items-center p-4 md:p-6 border-b">
//                             <h2 className="text-lg md:text-xl font-semibold text-gray-800">{editingPoll ? 'Update Poll' : 'Create a New Poll'}</h2>
//                             <button onClick={() => setShowPollModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
//                         </div>
//                         <div className="p-4 md:p-6 space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Poll Question</label>
//                                 <input type="text" value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} placeholder="What do you want to ask?" className="w-full p-2 border rounded-md"/>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                                 <textarea value={pollDescription} onChange={(e) => setPollDescription(e.target.value)} placeholder="Provide more context..." rows={3} className="w-full p-2 border rounded-md"/>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//                                 <input type="text" value={pollLocation} onChange={(e) => setPollLocation(e.target.value)} placeholder="e.g., San Diego, CA" className="w-full p-2 border rounded-md"/>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Poll Options</label>
//                                 {pollOptions.map((option, index) => (
//                                     <div key={index} className="flex gap-2 mb-2">
//                                         <input type="text" value={option} onChange={(e) => updatePollOption(index, e.target.value)} placeholder={`Option ${index + 1}`} className="flex-1 p-2 border rounded-md"/>
//                                         {pollOptions.length > 2 && <button onClick={() => removePollOption(index)} className="p-2 text-red-500 font-bold">&times;</button>}
//                                     </div>
//                                 ))}
//                                 {pollOptions.length < 10 && <button onClick={addPollOption} className="text-sm text-green-600 font-semibold">+ Add Option</button>}
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Closes On</label>
//                                 <input type="date" value={closesOn} onChange={(e) => setClosesOn(e.target.value)} className="w-full p-2 border rounded-md"/>
//                             </div>
//                             <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
//                                 <button onClick={() => setShowPollModal(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 w-full sm:w-auto">Cancel</button>
//                                 <button onClick={handleSubmitPoll} disabled={isPollSubmitting} className="px-6 py-2 bg-green-800 text-white rounded-md disabled:bg-green-400 hover:bg-green-700 w-full sm:w-auto">
//                                     {isPollSubmitting ? 'Saving...' : editingPoll ? 'Update Poll' : 'Create Poll'}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
            
//             {closePollId && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 max-w-md w-full mx-4">
//                         <div className="text-center">
//                             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
//                                 <span className="text-2xl">🛑</span>
//                             </div>
//                             <h3 className="text-lg font-bold text-gray-900 mb-2">Close Poll</h3>
//                             <p className="text-sm text-gray-500 mb-6">Are you sure you want to close this poll?</p>
//                         </div>
//                         <div className="flex flex-col sm:flex-row gap-3">
//                             <button onClick={cancelClosePoll} className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200">Cancel</button>
//                             <button onClick={confirmClosePoll} className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700">Close Poll</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
            
//             {showResultsModal && selectedPollResults && ( 
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 max-w-lg w-full">
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-lg md:text-xl font-bold text-green-800">Poll Results</h3>
//                             <button onClick={() => setShowResultsModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
//                         </div>
//                         <div className="mb-4">
//                             <div className="font-semibold text-gray-900 text-base md:text-lg mb-2">{selectedPollResults.title}</div>
//                             <div className="text-sm text-gray-500 mb-4"> Created: {new Date(selectedPollResults.createdAt).toLocaleDateString()} </div>
//                             <div className="space-y-3">
//                                 {(() => {
//                                     const mockTotalVotes = 50;
//                                     const mockOptions = [
//                                         { text: "Option A", votes: 20 },
//                                         { text: "Option B", votes: 30 },
//                                     ];
//                                     return Array.isArray(mockOptions) && mockOptions.map((opt, i) => {
//                                         const percent = mockTotalVotes > 0 ? Math.round(((opt.votes || 0) / mockTotalVotes) * 100) : 0;
//                                         return (
//                                             <div key={i}>
//                                                 <div className="flex justify-between items-center mb-1">
//                                                     <span className="text-sm font-medium text-gray-700">{opt.text}</span>
//                                                     <span className="text-sm font-bold text-green-800"> {opt.votes} votes ({percent}%) </span>
//                                                 </div>
//                                                 <div className="w-full bg-gray-200 rounded-full h-4">
//                                                     <div className="bg-green-500 h-4 rounded-full text-xs text-white flex items-center justify-center transition-all duration-500" style={{ width: `${percent}%` }} >
//                                                         {percent > 10 && `${percent}%`}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         );
//                                     });
//                                 })()}
//                             </div>
//                         </div>
//                         <div className="flex justify-end mt-6">
//                             <button onClick={() => setShowResultsModal(false)} className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 w-full sm:w-auto"> Close </button>
//                         </div>
//                     </div>
//                 </div> 
//             )}
//         </>
//     );
// };

// export default OfficialDashboard;


import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api';
import OfficialSettings from './OfficialSettings';

// --- CHART.JS IMPORTS ---
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    BarElement
);

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
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6 flex flex-col items-center">
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

// Mobile Navigation Component
const MobileNav = ({ activeTab, handleNavClick, navigationItems, userInfo, handleSignOutClick, setShowMobileNav }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
            <div className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-green-300 to-green-400 p-6 shadow-xl flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center text-green-800">
                        <div className="text-3xl mr-3">🏛️</div>
                        <div className="text-2xl font-bold">CIVIX</div>
                    </div>
                    <button 
                        onClick={() => setShowMobileNav(false)}
                        className="text-2xl text-green-800 hover:text-green-900"
                    >
                        ×
                    </button>
                </div>
                <div className="bg-white bg-opacity-30 rounded-xl p-5 mb-8">
                    <div className="bg-green-800 text-white px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">VERIFIED OFFICIAL</div>
                    <div className="text-lg font-bold text-green-800 mb-1">{userInfo.fullName}</div>
                    <div className="text-green-700 text-sm mb-2">{userInfo.email}</div>
                </div>
                <nav className="flex-1">
                    {navigationItems.map((item) => (
                        <div key={item.id} className={`flex items-center p-4 m-2 rounded-lg cursor-pointer transition-all duration-300 text-green-800 font-medium hover:bg-white hover:bg-opacity-40 ${activeTab === item.id ? 'bg-white bg-opacity-50' : ''}`} 
                             onClick={() => { handleNavClick(item.id); setShowMobileNav(false); }}>
                            <span className="mr-3 text-lg">{item.icon}</span>
                            <span className="flex-1">{item.label}</span>
                            {item.badge > 0 && <span className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">{item.badge}</span>}
                        </div>
                    ))}
                </nav>
                <div className="mt-8 pt-5 border-t border-white border-opacity-30">
                    <div className="flex items-center p-2 m-1 rounded-lg cursor-pointer text-black-400 font-medium hover:bg-white hover:bg-opacity-40" 
                         onClick={() => { handleSignOutClick(); setShowMobileNav(false); }}>
                        <span className="mr-3 text-lg">🚪</span> Sign Out
                    </div>
                </div>
            </div>
        </div>
    );
};

const OfficialDashboard = () => {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState('dashboard');
    const [petitions, setPetitions] = useState([]);
    const [polls, setPolls] = useState([]);
    const [stats, setStats] = useState({ petitions: 0, polls: 0, responseRate: '0%', civicParticipationRate: '0%' });
    const [engagement, setEngagement] = useState({ 
        activeUsers: 0, 
        civicParticipationRate: '0%', 
        avgResponseTime: 0 
    });
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
    const [closePollId, setClosePollId] = useState(null);
    const [showMobileNav, setShowMobileNav] = useState(false);

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

    // When user navigates with browser Back/Forward, show the sign-out modal instead of navigating away
    const location = useLocation();
    useEffect(() => {
        const handlePopState = () => {
            setShowSignOutModal(true);
            // Keep user on the same page while modal is open
            navigate(location.pathname, { replace: true });
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [navigate, location.pathname]);

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
            const response = await API.getPetitions({ limit: 1000 });
            setPetitions(response.data.petitions || []);
        } catch (err) {
            console.error('Failed to fetch petitions:', err);
            setPetitions([]);
        }
    };
    const fetchPolls = async () => {
        try {
            const response = await API.getAllPolls();
            const raw = response.data || [];
            // ensure createdAt exists (fallback to ObjectId timestamp) and sort newest first
            const pollsWithDate = raw.map(p => ({
                ...p,
                createdAt: p.createdAt || (p._id ? new Date(parseInt(String(p._id).substring(0, 8), 16) * 1000).toISOString() : undefined)
            }));
            pollsWithDate.sort((a, b) => (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime()));
            setPolls(pollsWithDate);
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
        // Prefill form when editing an existing response so officials can update their reply
        setSelectedPetition(petition);
        setShowResponseModal(true);
        setResponseForm({
            // try several possible fields that might hold an existing response
            message: petition.response || petition.responseMessage || petition.responseText || '',
            responseStatus: petition.status || 'under-consideration',
        });
    };
    const closeResponseModal = () => {
        setShowResponseModal(false);
        setSelectedPetition(null);
    };
    const handleFormChange = (e) => setResponseForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const submitResponse = async () => {
        if (!selectedPetition || !responseForm.message.trim()) {
            setToast({ show: true, message: "Please fill in the response message", type: "error" });
            return;
        }
        setIsSubmitting(true);
        try {
            // Upsert behavior: create or update an existing response
            await API.respondToPetition(selectedPetition._1d || selectedPetition._id, {
                ...responseForm,
                respondedBy: userInfo?.fullName || 'Public Official'
            });

            const alreadyResponded = Boolean(selectedPetition?.respondedAt || selectedPetition?.response || ['responded', 'approved', 'rejected'].includes(selectedPetition?.status));
            setToast({ show: true, message: alreadyResponded ? "Response updated successfully!" : "Response submitted successfully!", type: "success" });
            closeResponseModal();
            fetchPetitions();
            fetchStats();
        } catch (error) {
            console.error('Error submitting response:', error);
            setToast({ show: true, message: "Failed to submit response. Please try again.", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
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
                // send options as an array of strings to match backend expectation
                options: pollOptions.map(opt => opt),
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
            // prefer server-provided message when available
            const serverMessage = err?.response?.data?.error || err?.response?.data?.message;
            console.error('Error saving poll:', err, serverMessage);
            setToast({ show: true, message: serverMessage || "Error saving poll.", type: "error" });
        } finally {
            setIsPollSubmitting(false);
        }
    };
    const viewResults = async (pollId) => {
        try {
            const response = await API.getPollResults(pollId);
            setSelectedPollResults({
                title: response.data.question,
                options: response.data.options,
                createdAt: new Date().toISOString(),
            });
            setShowResultsModal(true);
        } catch (err) {
            alert('Failed to fetch poll results');
        }
    };
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

    // --- CHART DATA CALCULATIONS ---
    const engagementChartData = useMemo(() => {
        const labels = Array.from({ length: 30 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.toLocaleDateString('en-CA');
        });

        const petitionCounts = new Array(30).fill(0);
        const signatureCounts = new Array(30).fill(0);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        petitions.forEach(p => {
            const createdAt = new Date(p.createdAt);
            if (createdAt >= thirtyDaysAgo) {
                const diffTime = new Date().setHours(0,0,0,0) - new Date(createdAt).setHours(0,0,0,0);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays >= 0 && diffDays < 30) {
                    petitionCounts[29 - diffDays]++;
                }
            }
            p.signatures?.forEach(sig => {
                if (sig.signedAt) {
                    const signedAt = new Date(sig.signedAt);
                    if (signedAt >= thirtyDaysAgo) {
                        const sigDiffTime = new Date().setHours(0,0,0,0) - new Date(signedAt).setHours(0,0,0,0);
                        const sigDiffDays = Math.floor(sigDiffTime / (1000 * 60 * 60 * 24));
                        if (sigDiffDays >= 0 && sigDiffDays < 30) {
                            signatureCounts[29 - sigDiffDays]++;
                        }
                    }
                }
            });
        });

        const displayLabels = labels.map(l => new Date(l).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        return {
            labels: displayLabels,
            datasets: [
                {
                    label: 'New Signatures', data: signatureCounts,
                    borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)', tension: 0.2,
                },
                {
                    label: 'New Petitions', data: petitionCounts,
                    borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)', tension: 0.2,
                }
            ],
        };
    }, [petitions]);

    const responseTimeChartData = useMemo(() => {
        const respondedPetitions = petitions.filter(p =>
            ['responded', 'approved', 'rejected'].includes(p.status) && p.respondedAt
        );
        const timeByCategory = respondedPetitions.reduce((acc, p) => {
            const category = p.category || 'Uncategorized';
            const createdAt = new Date(p.createdAt);
            const respondedAt = new Date(p.respondedAt);
            if (!respondedAt || respondedAt < createdAt) return acc;
            const diffTime = Math.abs(respondedAt - createdAt);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (!acc[category]) acc[category] = { totalDays: 0, count: 0 };
            acc[category].totalDays += diffDays;
            acc[category].count++;
            return acc;
        }, {});
        const labels = Object.keys(timeByCategory);
        const data = labels.map(cat => (timeByCategory[cat].totalDays / timeByCategory[cat].count).toFixed(1));
        return {
            labels,
            datasets: [{
                label: 'Average Response Time (Days)', data,
                backgroundColor: 'rgba(54, 162, 235, 0.6)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1,
            }]
        };
    }, [petitions]);

    // --- RENDER LOGIC ---
    const getStatusConfig = (status) => {
        const configs = {
            'pending': { class: 'bg-yellow-100 text-yellow-700', text: 'Pending Review' },
            'under-consideration': { class: 'bg-blue-100 text-blue-700', text: 'Under Consideration' },
            'approved': { class: 'bg-green-100 text-green-700', text: 'Approved' },
            'rejected': { class: 'bg-red-100 text-red-700', text: 'Rejected' },
            'active': { class: 'bg-green-100 text-green-700', text: 'Active' },
            'responded': { class: 'bg-indigo-100 text-indigo-700', text: 'Responded' },
        };
        return configs[status] || configs['pending'];
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-green-400">
                                <div className="text-gray-600 text-sm">Total Petitions</div>
                                <div className="text-2xl md:text-3xl font-bold text-green-800">{stats.petitions}</div>
                            </div>
                            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-blue-400">
                                <div className="text-gray-600 text-sm">Total Active Polls</div>
                                <div className="text-2xl md:text-3xl font-bold text-green-800">{polls.length}</div>
                            </div>
                            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-purple-400">
                                <div className="text-gray-600 text-sm">Response Rate</div>
                                <div className="text-2xl md:text-3xl font-bold text-green-800">{stats.responseRate}</div>
                            </div>
                            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-orange-400">
                                <div className="text-gray-600 text-sm">Civic Participation Rate</div>
                                <div className="text-2xl md:text-3xl font-bold text-green-800">{stats.civicParticipationRate}</div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg lg:col-span-2">
                                <h2 className="text-lg md:text-xl font-bold text-green-800 mb-4">Recent Petitions</h2>
                                {petitions.slice(0, 5).map(p => (
                                    <div key={p._id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg mb-2 hover:bg-gray-100 transition-colors">
                                        <div className="mb-2 sm:mb-0">
                                            <p className="font-medium text-green-800 text-sm md:text-base">{p.title}</p>
                                            <p className="text-xs text-gray-500">{p.signatures?.length || 0} signatures</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusConfig(p.status).class} self-start sm:self-auto`}>
                                            {getStatusConfig(p.status).text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
                                <h2 className="text-lg md:text-xl font-bold text-green-800 mb-4 md:mb-6">Community Engagement</h2>
                                <div className="space-y-4 md:space-y-6">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600 font-medium text-sm md:text-base">Active Users (7d)</span>
                                        <span className="text-xl md:text-2xl font-bold text-green-800">{engagement.activeUsers}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600 font-medium text-sm md:text-base">Civic Participation</span>
                                        <span className="text-xl md:text-2xl font-bold text-green-800">{engagement.civicParticipationRate}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600 font-medium text-sm md:text-base">Avg. Response Time</span>
                                        <span className="text-xl md:text-2xl font-bold text-green-800">{engagement.avgResponseTime} <span className="text-xs md:text-sm">days</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
            case 'petitions':
                return (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-b from-green-300 to-green-400 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl text-green-800">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2">📋 Petitions Management</h2>
                                    <p className="text-white text-sm md:text-lg">Review and respond to community petitions</p>
                                </div>
                                <div className="text-right">
                                    <div className="bg-white bg-opacity-20 rounded-xl p-3 md:p-4">
                                        <div className="text-xl md:text-2xl font-bold">{petitions.length}</div>
                                        <div className="text-xs md:text-sm text-green-800">Total Petitions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-4 md:gap-6">
                            {petitions.length > 0 ? petitions.map((p) => {
                                const isResponded = ['responded', 'approved', 'rejected'].includes(p.status);
                                return (
                                    <div key={p._id} className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-3 md:gap-4 mb-4">
                                                    <div className="bg-green-100 rounded-full p-2 md:p-3 flex-shrink-0">
                                                        <div className="text-green-600 text-lg md:text-xl">📄</div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{p.title}</h3>
                                                        <p className="text-gray-600 leading-relaxed line-clamp-2 text-sm md:text-base">{p.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-blue-50 rounded-full p-1"><div className="text-blue-600 text-xs md:text-sm">👤</div></div>
                                                        <span className="text-xs md:text-sm text-gray-600"><span className="font-medium">By:</span> {p.creator?.fullName || 'Anonymous'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-purple-50 rounded-full p-1"><div className="text-purple-600 text-xs md:text-sm">✍️</div></div>
                                                        <span className="text-xs md:text-sm text-gray-600"><span className="font-medium">{p.signatures?.length || 0}</span> signatures</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-gray-50 rounded-full p-1"><div className="text-gray-600 text-xs md:text-sm">📅</div></div>
                                                        <span className="text-xs md:text-sm text-gray-600">{new Date(p.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className={`inline-flex items-center px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold ${getStatusConfig(p.status).class} shadow-sm`}>
                                                        <div className="w-2 h-2 rounded-full bg-current mr-2 opacity-70"></div>
                                                        {getStatusConfig(p.status).text}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 md:gap-3 items-center">
                                                <button
                                                    onClick={() => respondToPetition(p)}
                                                    disabled={isResponded}
                                                    className={`px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 min-w-[100px] md:min-w-[120px] ${
                                                        isResponded
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5'
                                                        }`}
                                                >
                                                    {isResponded ? '✅ Responded' : '💬 Respond'}
                                                </button>

                                                {isResponded && (
                                                    <button
                                                        onClick={() => respondToPetition(p)}
                                                        className="px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold bg-gray-100 text-gray-400 cursor-pointer ml-2"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="text-center py-12 bg-white rounded-xl md:rounded-2xl shadow-lg">
                                    <div className="text-4xl md:text-6xl mb-4">📭</div>
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">No Petitions Found</h3>
                                    <p className="text-gray-500 text-sm md:text-base">There are currently no petitions to review.</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'polls':
                return (
                    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-lg">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-green-900">Polls Management</h2>
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
                                className="bg-green-800 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-green-700 font-semibold shadow text-sm md:text-base"
                            >
                                ＋ Create New Poll
                            </button>
                        </div>
                        <div className="space-y-4 md:space-y-6">
                            {polls.length > 0 ? polls.map((poll) => (
                                <div key={poll._id} className="bg-gray-50 p-4 md:p-6 rounded-lg md:rounded-xl border-2 border-green-500 shadow-sm">
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                        <h3 className="text-lg md:text-xl font-bold text-green-900">{poll.title}</h3>
                                        {poll.isOfficial && (
                                            <span className="px-2 py-1 bg-yellow-300 text-yellow-900 rounded-full text-xs font-bold flex items-center gap-1 self-start md:self-auto">
                                                <span>★</span> Official Poll
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-600 mb-2">
                                        Location: <span className="font-semibold">{poll.targetLocation}</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2">
                                        <p className="text-xs md:text-sm text-gray-600">Created: {new Date(poll.createdAt).toLocaleDateString()}</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {poll.createdBy === userInfo._id && (
                                                <button
                                                    onClick={() => {
                                                        setEditingPoll(poll);
                                                        setPollQuestion(poll.title);
                                                        setPollDescription(poll.description);
                                                        setPollOptions(poll.options.map(o => o.text));
                                                        setPollLocation(poll.targetLocation);
                                                        setClosesOn(poll.closeDate?.slice(0, 10) || '');
                                                        setShowPollModal(true);
                                                    }}
                                                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs md:text-base font-bold shadow hover:bg-yellow-600 transition-all duration-150"
                                                    style={{ minWidth: 70 }}
                                                >
                                                    ✏️ Edit
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeletePoll(poll._id)}
                                                className="bg-red-600 text-white px-4 py-2 md:px-1 md:py-1 rounded-lg md:rounded-xl text-xs md:text-lg font-bold md:font-extrabold shadow md:shadow-lg border-2 border-red-800 flex items-center gap-2 hover:bg-red-700 hover:scale-105 transition-all duration-150"
                                                style={{ minWidth: 120 }}
                                                title="Close this poll"
                                            >
                                                <span role="img" aria-label="close">🛑</span>
                                                Close Poll
                                            </button>
                                        </div>
                                    </div>
                                    {poll.description && (
                                        <p className="text-gray-700 mb-3 text-sm md:text-base">{poll.description}</p>
                                    )}
                                    {poll.options && (
                                        <div className="space-y-2 mt-2">
                                            {poll.options.map((opt, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-green-100 px-2 py-1 md:px-3 md:py-2 rounded">
                                                    <span className="font-semibold text-green-900 text-xs md:text-sm">{opt.text}</span>
                                                    <span className="font-bold text-green-800 bg-green-200 px-2 py-1 md:px-3 md:py-1 rounded text-xs md:text-base">{opt.votes ?? 0} votes</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="text-center py-8 md:py-12 text-gray-500 text-base md:text-lg">No polls found.</div>
                            )}
                        </div>
                    </div>
                );
            case 'reports':
                if (isReportLoading) return <div className="text-center p-10 bg-white rounded-xl shadow-lg">Loading Report...</div>;
                if (!reportsData) return <div className="text-center p-10 text-red-500 bg-white rounded-xl shadow-lg">Could not load report data.</div>;
                
                const statusChartData = { labels: ['Responded', 'Awaiting Response'], datasets: [{ data: [reportsData.respondedCount, reportsData.pendingCount], backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(249, 115, 22, 0.8)'], borderWidth: 2, borderColor: ['rgba(34, 197, 94, 1)', 'rgba(249, 115, 22, 1)'] }] };
                
                const petitionsByCategory = petitions.reduce((acc, petition) => {
                    const category = petition.category || 'Uncategorized';
                    acc[category] = (acc[category] || 0) + 1;
                    return acc;
                }, {});

                const categoryChartData = {
                    labels: Object.keys(petitionsByCategory),
                    datasets: [
                        {
                            label: 'Petitions',
                            data: Object.values(petitionsByCategory),
                            backgroundColor: ['#4BC0C0', '#36A2EB', '#FFCE56', '#9966FF', '#FF6384', '#FF9F40'],
                            borderColor: '#FFFFFF',
                            borderWidth: 2,
                        },
                    ],
                };
                
                const exportPetitionsCsv = () => {
                    if (!petitions || petitions.length === 0) {
                        setToast({ show: true, message: 'No petitions to export', type: 'error' });
                        return;
                    }

                    const escapeCsv = (val) => '"' + String(val ?? '').replace(/"/g, '""') + '"';

                    const headers = ['ID', 'Title', 'Status', 'Submitted', 'Signatures', 'Official Response'];
                    const rows = petitions.map(p => {
                        const id = p._id || p.id || '';
                        const title = p.title || '';
                        const status = p.status || '';
                        const submitted = p.createdAt ? new Date(p.createdAt).toLocaleString() : '';
                        const signatures = (p.signatures && p.signatures.length) ? p.signatures.length : 0;
                        const officialResponse = (p.officialResponse && p.officialResponse.message) ? p.officialResponse.message : 'N/A';
                        return [id, title, status, submitted, signatures, officialResponse].map(escapeCsv).join(',');
                    });

                    const csvContent = [headers.map(escapeCsv).join(','), ...rows].join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `petitions_report_${new Date().toISOString().slice(0,10)}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                    setToast({ show: true, message: 'Export started — check your downloads folder.', type: 'success' });
                };

                return (
                    <div className="space-y-10">
                        {/* Enhanced Header Section */}
                        <div className="bg-gradient-to-r from-green-300 via-green-400 to-green-500 rounded-3xl p-10 shadow-2xl text-green-800">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white bg-opacity-25 backdrop-blur-sm rounded-2xl p-4">
                                        <div className="text-4xl">📊</div>
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-bold mb-2">Analytics Dashboard</h2>
                                        <p className="text-green-700 text-lg">Comprehensive civic engagement insights</p>
                                    </div>
                                </div>
                                <div className="text-center lg:text-right">
                                    <div className="bg-white bg-opacity-25 backdrop-blur-sm rounded-2xl p-6 w-64">
                                        <div className="text-4xl font-bold mb-1">{((reportsData.respondedCount / (reportsData.totalPetitions || 1)) * 100).toFixed(0)}%</div>
                                        <div className="text-sm text-green-700 font-semibold">Overall Response Rate</div>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            onClick={exportPetitionsCsv}
                                            disabled={!petitions || petitions.length === 0}
                                            className={`px-4 py-3 rounded-2xl font-semibold text-sm transition w-64 ${(!petitions || petitions.length === 0) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-800 text-white hover:bg-green-700 shadow'}`}
                                        >
                                            Export CSV
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Stats Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="bg-blue-100 rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300"><div className="text-blue-600 text-3xl">📋</div></div>
                                    <div className="text-right"><div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total</div><div className="text-4xl font-bold text-blue-600">{reportsData.totalPetitions || 0}</div></div>
                                </div>
                                <h3 className="text-gray-800 font-bold text-lg mb-2">Total Petitions</h3>
                                <p className="text-sm text-gray-600">All submitted community requests</p>
                                <div className="mt-4 h-1 bg-blue-100 rounded-full"><div className="h-1 bg-blue-500 rounded-full w-full"></div></div>
                            </div>
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="bg-green-100 rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300"><div className="text-green-600 text-3xl">✅</div></div>
                                    <div className="text-right"><div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Completed</div><div className="text-4xl font-bold text-green-600">{reportsData.respondedCount || 0}</div></div>
                                </div>
                                <h3 className="text-gray-800 font-bold text-lg mb-2">Responded</h3>
                                <p className="text-sm text-gray-600">Successfully addressed petitions</p>
                                <div className="mt-4 h-1 bg-green-100 rounded-full"><div className="h-1 bg-green-500 rounded-full" style={{width: `${(reportsData.respondedCount / (reportsData.totalPetitions || 1)) * 100}%`}}></div></div>
                            </div>
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="bg-orange-100 rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300"><div className="text-orange-600 text-3xl">⏳</div></div>
                                    <div className="text-right"><div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Pending</div><div className="text-4xl font-bold text-orange-600">{reportsData.pendingCount || 0}</div></div>
                                </div>
                                <h3 className="text-gray-800 font-bold text-lg mb-2">Awaiting Response</h3>
                                <p className="text-sm text-gray-600">Requires immediate attention</p>
                                <div className="mt-4 h-1 bg-orange-100 rounded-full"><div className="h-1 bg-orange-500 rounded-full" style={{width: `${(reportsData.pendingCount / (reportsData.totalPetitions || 1)) * 100}%`}}></div></div>
                            </div>
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="bg-purple-100 rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300"><div className="text-purple-600 text-3xl">⚡</div></div>
                                    <div className="text-right"><div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Average</div><div className="text-4xl font-bold text-purple-600">{reportsData.averageResponseTimeDays || 'N/A'}</div></div>
                                </div>
                                <h3 className="text-gray-800 font-bold text-lg mb-2">Response Time</h3>
                                <p className="text-sm text-gray-600">Days to provide response</p>
                                <div className="mt-4 h-1 bg-purple-100 rounded-full"><div className="h-1 bg-purple-500 rounded-full w-3/4"></div></div>
                            </div>
                        </div>

                        {/* Pie Charts Section */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
                                <div className="text-center mb-10"><h3 className="text-2xl font-bold text-gray-800">Response Status Distribution</h3><p className="text-gray-600">Breakdown of petition response status</p></div>
                                <div className="w-full h-80"><Doughnut data={statusChartData} options={{ cutout: '65%', responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }}}} /></div>
                            </div>
                            {categoryChartData.labels.length > 0 && (
                                <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
                                    <div className="text-center mb-10"><h3 className="text-2xl font-bold text-gray-800">Petitions by Category</h3><p className="text-gray-600">Distribution across categories</p></div>
                                    <div className="w-full h-80"><Pie data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }}}} /></div>
                                </div>
                            )}
                        </div>

                        {/* Engagement and Responsiveness Charts */}
                        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
                           <div className="text-center mb-8">
                               <h3 className="text-2xl font-bold text-gray-800 mb-2">Engagement Over Time</h3>
                               <p className="text-gray-600">New petitions and signatures over the last 30 days.</p>
                           </div>
                           <Line data={engagementChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                        </div>

                        {responseTimeChartData.labels.length > 0 && (
                           <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
                               <div className="text-center mb-8">
                                   <h3 className="text-2xl font-bold text-gray-800 mb-2">Official Responsiveness by Category</h3>
                                   <p className="text-gray-600">Average time to respond to petitions, grouped by category.</p>
                               </div>
                               <Bar data={responseTimeChartData} options={{ indexAxis: 'y', responsive: true, plugins: { legend: { display: false } } }} />
                           </div>
                        )}

                        {/* Performance Insights Section */}
                        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl p-10 shadow-xl border border-gray-200">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-indigo-100 rounded-2xl p-4">
                                    <div className="text-indigo-600 text-3xl">💡</div>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-gray-800 mb-2">Performance Insights</h3>
                                    <p className="text-gray-600">Key metrics and operational efficiency analysis</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-blue-100 rounded-xl p-2">
                                            <div className="text-blue-600 text-xl">⚡</div>
                                        </div>
                                        <h4 className="font-bold text-gray-800 text-xl">Response Efficiency</h4>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between mb-3">
                                                <span className="text-sm text-gray-700 font-medium">Overall Response Rate</span>
                                                <span className="font-bold text-indigo-600 text-lg">{((reportsData.respondedCount / (reportsData.totalPetitions || 1)) * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                                                <div 
                                                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 shadow-sm" 
                                                    style={{width: `${(reportsData.respondedCount / (reportsData.totalPetitions || 1)) * 100}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-gray-100">
                                            <div className="text-sm text-gray-600">
                                                <span className="font-semibold text-gray-800">Target:</span> 80% response rate
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-emerald-100 rounded-xl p-2">
                                            <div className="text-emerald-600 text-xl">👥</div>
                                        </div>
                                        <h4 className="font-bold text-gray-800 text-xl">Community Engagement</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                                            <span className="text-sm text-gray-700 font-medium">Active Petitions</span>
                                            <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold">{reportsData.pendingCount}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                                            <span className="text-sm text-gray-700 font-medium">Resolved Issues</span>
                                            <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold">{reportsData.respondedCount}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                                            <span className="text-sm text-gray-700 font-medium">Avg. Response Time</span>
                                            <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold">{reportsData.averageResponseTimeDays || 'N/A'} days</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                );
                case 'settings':
                    return <OfficialSettings />;

            default: return <div>Select a tab</div>;
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
                <div className="w-80 bg-gradient-to-b from-green-300 to-green-400 p-6 shadow-xl flex flex-col sticky top-0 h-screen">
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
                    <div className="mt-8 sticky bottom-0 border-t border-white border-opacity-30">
                        <div
                            className={`flex items-center p-4 m-2 rounded-lg cursor-pointer transition-all duration-300 text-green-800 font-medium hover:bg-white hover:bg-opacity-40`}
                            onClick={handleSignOutClick}
                        >
                            <span className="mr-3 text-lg">🚪</span>
                            <span className="flex-1">Sign Out</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto">
<h1 className="text-3xl font-bold mb-6 text-green-800">
  {activeTab === 'dashboard' 
    ? `Welcome back, ${firstName}!` 
    : activeTab === 'settings' 
      ? '' 
      : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
  }
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