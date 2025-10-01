
//   import axios from "axios";
// import { Plus, X } from 'lucide-react';
// import React, { useEffect, useState } from 'react';
// interface Poll {
//   id: string;
//   question: string;
//   description: string;
//   options: string[];
//   closesOn: string;
//   votes: number[];
//   totalVotes: number;
//   hasVoted: boolean;
//   location: string;
//   isMyPoll: boolean;
// }
// interface ToastModalProps {
//   message: string;
//   onClose: () => void;
//   show: boolean;
//   type?: "success" | "error";
// }

// const ToastModal: React.FC<ToastModalProps> = ({ message, onClose, show, type = "success" }) => {
//   useEffect(() => {
//     if (show) {
//       const timer = setTimeout(onClose, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [show, onClose]);

//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
//       <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 flex flex-col items-center">
//         <div className={`mb-4 text-4xl ${type === "success" ? "text-green-500" : "text-red-500"}`}>
//           {type === "success" ? "✔️" : "❌"}
//         </div>
//         <div className="text-lg font-semibold text-gray-800 mb-2 text-center">{message}</div>
//         <div className="text-sm text-gray-500 mb-4 text-center">This popup will close automatically.</div>
//         <button
//           onClick={onClose}
//           className={`px-6 py-2 rounded-lg font-semibold ${
//             type === "success" ? "bg-green-600 text-white hover:bg-green-700" : "bg-red-600 text-white hover:bg-red-700"
//           }`}
//         >
//           Close Now
//         </button>
//       </div>
//     </div>
//   );
// };
// const Polls: React.FC = () => {
  
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [polls, setPolls] = useState<Poll[]>([]);
//   const [activeTab, setActiveTab] = useState('Active Polls');


//   // Form state
//   const [pollQuestion, setPollQuestion] = useState('');
//   const [pollDescription, setPollDescription] = useState('');
//   const [pollOptions, setPollOptions] = useState(['', '']);
//   const [pollLocation, setPollLocation] = useState('');
//   const [selectedLocation, setSelectedLocation] = useState("All Locations");
//   const [locationError, setLocationError] = useState('');
//   const [closesOn, setClosesOn] = useState('');
//   const [toast, setToast] = useState<{ show: boolean; message: string; type?: "success" | "error" }>({ show: false, message: "", type: "success" });
//   const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
//   const [toastMessage, setToastMessage] = useState('');
//   const tabs = ['Active Polls', 'Polls I Voted On', 'My Polls'];/* new */


//   useEffect(() => {
//   const currentUserId = localStorage.getItem("userId");
//   axios.get("http://localhost:5000/api/polls")
//     .then(async res => {
//       let polls = res.data.map((poll: any) => ({
//         id: poll._id,
//         question: poll.title,
//         description: poll.description,
//         options: poll.options.map((o: any) => o.text),
//         closesOn: poll.closeDate,
//         votes: poll.options.map((o: any) => o.votes),
//         totalVotes: poll.options.reduce((sum: number, o: any) => sum + o.votes, 0),
//         hasVoted: false,
//         location: poll.targetLocation || '',
//         isMyPoll: poll.createdBy === currentUserId
//       }));

//       // Fetch voted poll IDs for this user
//       if (currentUserId) {
//         const votedRes = await axios.get(`http://localhost:5000/api/polls/voted?userId=${currentUserId}`);
//         const votedPollIds = votedRes.data;
//         polls = polls.map((poll: any) => ({
//           ...poll,
//           hasVoted: votedPollIds.includes(poll.id)
//         }));
//       }
//       setPolls(polls);
//     })
//     .catch(err => console.error("Error fetching polls:", err));
// }, []);

//   const addOption = () => {
//     if (pollOptions.length < 10) {
//       setPollOptions([...pollOptions, '']);
//     }
//   };

//   const removeOption = (index: number) => {
//     if (pollOptions.length > 2) {
//       setPollOptions(pollOptions.filter((_, i) => i !== index));
//     }
//   };
  
//   /* new */
//   const allLocations = [
//   "All Locations",
//   ...Array.from(new Set(polls.map((poll) => poll.location).filter(Boolean)))
// ];

//   const updateOption = (index: number, value: string) => {
//     const newOptions = [...pollOptions];
//     newOptions[index] = value;
//     setPollOptions(newOptions);
//   };
//   const fetchPolls = async () => {
//   const currentUserId = localStorage.getItem("userId");
//   const res = await axios.get("http://localhost:5000/api/polls");
//   let polls = res.data.map((poll: any) => ({
//     id: poll._id,
//     question: poll.title,
//     description: poll.description,
//     options: poll.options.map((o: any) => o.text),
//     closesOn: poll.closeDate,
//     votes: poll.options.map((o: any) => o.votes),
//     totalVotes: poll.options.reduce((sum: number, o: any) => sum + o.votes, 0),
//     hasVoted: false,
//     location: poll.targetLocation || 'San Diego, CA',
//     isMyPoll: poll.createdBy === currentUserId
//   }));
//   if (currentUserId) {
//     const votedRes = await axios.get(`http://localhost:5000/api/polls/voted?userId=${currentUserId}`);
//     const votedPollIds = votedRes.data;
//     polls = polls.map((poll: any) => ({
//       ...poll,
//       hasVoted: votedPollIds.includes(poll.id)
//     }));
//   }
//   setPolls(polls);
// };
//   // Updated createPoll to send data to backend
//   const createPoll = async () => {
 
//     const userId = localStorage.getItem("userId");
//   if (!userId) {
//     setToastMessage("You must be logged in to create a poll.");
//     setTimeout(() => setToastMessage(''), 2000);
//     return;
//   }
//   /* new */
//   if (!pollLocation.trim()) {
//     setToastMessage( "Location is required!");
//     return;
//   }
//   else {
//     setLocationError('');
//   }
//   /* new */
//     const pollData = {
//       title: pollQuestion.trim(),
//       description: pollDescription.trim(),
//       options: pollOptions.filter(opt => opt.trim()),
//       targetLocation: pollLocation.trim(), // or make dynamic
//       createdBy: userId, // replace with real user id if available
//       closeDate: closesOn,
//     };

//     try {
//       const res = await axios.post("http://localhost:5000/api/polls", pollData);
//        await fetchPolls();
//       // Add the new poll to the list (optional: refetch all polls instead)
//       setPolls([
//         {
//           id: res.data._id,
//           question: res.data.title,
//           description: res.data.description,
//           options: res.data.options.map((o: any) => o.text),
//           closesOn: res.data.closeDate,
//           votes: res.data.options.map((o: any) => o.votes),
//           totalVotes: res.data.options.reduce((sum: number, o: any) => sum + o.votes, 0),
//           hasVoted: false,
//           location: res.data.targetLocation || 'San Diego, CA',
//           isMyPoll: true
//         },
//         ...polls
//       ]);
//       // Reset form
//       setPollQuestion('');
//       setPollDescription('');
//       setPollOptions(['', '']);
//       setPollLocation('');
//       setClosesOn('');
//       setShowCreateModal(false);
 
// setToast({ show: true, message: "Poll created successfully! 🎉", type: "success" });

//     } catch (err: any) {
    
// setToast({ show: true, message: "Error: " + (err.response?.data?.error || err.message), type: "error" });
//     }
//   };


//     const voteOnPoll = async (pollId: string, optionIndex: number) => {
//   const userId = localStorage.getItem("userId");
//   if (!userId) {
//     setToastMessage("You must be logged in to vote.");
//     setTimeout(() => setToastMessage(''), 2000);
//     return;
//   }
//   try {
//     await axios.post(`http://localhost:5000/api/polls/${pollId}/vote`, {
//       userId,
//       selectedOption: optionIndex
//     });
//     await fetchPolls(); // <-- This makes the UI update instantly!
//     setToastMessage("Vote submitted!");
//     setTimeout(() => setToastMessage(''), 2000);
//     // Refetch polls or update local states
//     // ...rest of your code...
//   } catch (err: any) {
//     setToastMessage("Error voting: " + (err.response?.data?.error || err.message));
//     setTimeout(() => setToastMessage(''), 2000);
//   }
// };
//   /* const getFilteredPolls = () => {
//     switch (activeTab) {
//       case 'Active Polls':
//         return polls;
//       case 'Polls I Voted On':
//         return polls.filter(poll => poll.hasVoted);
//       case 'My Polls':
//         return polls.filter(poll => poll.isMyPoll);
//       case 'San Diego, CA':
//         return polls.filter(poll => poll.location === 'San Diego, CA');
//       default:
//         return polls;
//     }
//   }; */
//   /* new */
//    const getFilteredPolls = () => {
//   let filtered = polls;
//   switch (activeTab) {
//     case 'Active Polls':
//       break;
//     case 'Polls I Voted On':
//       filtered = filtered.filter(poll => poll.hasVoted);
//       break;
//     case 'My Polls':
//       filtered = filtered.filter(poll => poll.isMyPoll);
//       break;
//     default:
//       break;
//   }
//   if (selectedLocation !== "All Locations") {
//     filtered = filtered.filter(poll => poll.location === selectedLocation);
//   }
//   return filtered;
// };
//   /* new */
//   const filteredPolls = getFilteredPolls();

//   // ...rest of your component (JSX) remains unchanged...


//   // Handle edit button click
// const handleEditPoll = (poll: Poll) => {
//   setEditingPoll(poll);
//   setShowCreateModal(true);
//   setPollQuestion(poll.question);
//   setPollDescription(poll.description);
//   setPollOptions([...poll.options]);
//    setPollLocation(poll.location);
//   setClosesOn(poll.closesOn.split('T')[0]); // format date if needed
// };

// // Handle update poll
// const handleUpdatePoll = async () => {
//   if (!editingPoll) return;
//   const pollData = {
//     title: pollQuestion.trim(),
//     description: pollDescription.trim(),
//     options: pollOptions.filter(opt => opt.trim()),
//     targetLocation: pollLocation.trim(),
//     closeDate: closesOn,
//   };
//   try {
//     const res = await axios.put(`http://localhost:5000/api/polls/${editingPoll.id}`, pollData);
//     await fetchPolls();
  
//     setPolls(polls.map(p =>
//   p.id === editingPoll.id
//     ? {
//         ...p,
//         question: res.data.poll.title,
//         description: res.data.poll.description,
//         options: res.data.poll.options.map((o: any) => o.text),
//         closesOn: res.data.poll.closeDate,
//         location: res.data.poll.targetLocation
//       }
//     : p
// ));
//     setEditingPoll(null);
//     setShowCreateModal(false);
//     setPollQuestion('');
//     setPollDescription('');
//     setPollOptions(['', '']);
//     setPollLocation('');
//     setClosesOn('');
 
// setToast({ show: true, message: "Poll updated successfully! ✨", type: "success" });
//   } catch (err: any) {
   
// setToast({ show: true, message: "Error: " + (err.response?.data?.error || err.message), type: "error" });
//   }
// };
// const handleCloseModal = () => {
//   setShowCreateModal(false);
//   setEditingPoll(null);
//   setPollQuestion('');
//   setPollDescription('');
//   setPollOptions(['', '']);
//   /* new */
//   setLocationError('');

//   setClosesOn('');
// };
// // Handle delete poll
// const handleDeletePoll = async (pollId: string) => {
//   if (!window.confirm("Are you sure you want to delete this poll?")) return;
//   try {
//     await axios.delete(`http://localhost:5000/api/polls/${pollId}`);
//     await fetchPolls();
//     setPolls(polls.filter(p => p.id !== pollId));
    
// setToast({ show: true, message: "Poll deleted successfully! 🗑️", type: "success" });
//   } catch (err: any) {
 
// setToast({ show: true, message: "Error: " + (err.response?.data?.error || err.message), type: "error" });
//   }
   
// };


//   return (
//      <>


//      <ToastModal
//       show={toast.show}
//       message={toast.message}
//       type={toast.type}
//       onClose={() => setToast({ ...toast, show: false })}
//     />
//     <div className="flex-1 p-6 bg-gray-50 min-h-screen">
//       {/* Create Poll Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-800">Create a new poll</h2>
            
//               <button 
//                   onClick={handleCloseModal}
//                   className="text-gray-400 hover:text-gray-600"
//                    >
//                 <X className="h-6 w-6" />
//                  </button>
//             </div>

//             <div className="p-6">
//               <p className="text-sm text-gray-600 mb-6">
//                 Create a new poll to gather community feedback on local issues
//               </p>

//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Poll Question
//                 </label>
//                 <input
//                   type="text"
//                   value={pollQuestion}
//                   onChange={(e) => setPollQuestion(e.target.value)}
//                   placeholder="What do you want to ask the community?"
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">Keep your question clear and specific.</p>
//               </div>

//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   value={pollDescription}
//                   onChange={(e) => setPollDescription(e.target.value)}
//                   placeholder="Provide more context about the poll..."
//                   rows={3}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Give community members enough information to make an informed choice.
//                 </p>
//               </div>
//               <div className="mb-6">
//                 {/* <label className="block text-sm font-medium text-gray-700 mb-2">
//                      Location
//                 </label>
//                  <input
//                  type="text"
//                  value={pollLocation}
//                  onChange={(e) => setPollLocation(e.target.value)}
//                  placeholder="Enter location (e.g., San Diego, CA)"
//                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                 Specify the location relevant to this poll.
//                 </p> */}
//                 {/* new */}

//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//   Location <span className="text-red-500">*</span>
// </label>
// <input
//   type="text"
//   value={pollLocation}
//   onChange={(e) => setPollLocation(e.target.value)}
//   placeholder="Enter location (e.g., Delhi, Mumbai)"
//   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//   required
// />
// {/* new */}
// {locationError && (
//   <p className="text-red-500 text-xs mt-1">{locationError}</p>
// )}
// {/* new */}
//                 {/* new */}
//                 </div>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Poll Options
//                   </label>
//                   <div className="space-y-2">
//                     {pollOptions.map((option, index) => (
//                       <div key={index} className="flex gap-2">
//                         <input
//                           type="text"
//                           value={option}
//                           onChange={(e) => updateOption(index, e.target.value)}
//                           placeholder={`Option ${index + 1}`}
//                           className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                         {pollOptions.length > 2 && (
//                           <button
//                             onClick={() => removeOption(index)}
//                             className="p-2 text-red-500 hover:text-red-700"
//                           >
//                             <X className="h-4 w-4" />
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                     {pollOptions.length < 10 && (
//                       <button
//                         onClick={addOption}
//                         className="flex items-center gap-2 text-blue-600 hover:text-blue-700 p-2"
//                       >
//                         <Plus className="h-4 w-4" />
//                         Add Option
//                       </button>
//                     )}
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Add at least 2 options, up to a maximum of 10
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Closes On
//                   </label>
//                   <input
//                     type="date"
//                     value={closesOn}
//                     onChange={(e) => setClosesOn(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     Choose when this poll will close
//                   </p>
//                 </div>
//               </div>

//               <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
//                 <div className="flex items-start gap-3">
//                   <div className="bg-green-100 rounded-full p-1 mt-0.5">
//                     <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
//                       <span className="text-white text-xs font-bold">!</span>
//                     </div>
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-green-800 mb-1">Important information</h4>
//                     <p className="text-sm text-green-700">
//                       Polls should be designed to gather genuine community feedback on 
//                       issues that affect your area. Polls that are misleading or 
//                       designed to push a specific agenda may be removed.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-3 justify-end">
              
//                 <button
//   onClick={handleCloseModal}
//   className="px-6 py-2 text-gray-600 hover:text-gray-800"
// >
//   Cancel
// </button>
// <button
//   onClick={editingPoll ? handleUpdatePoll : createPoll}
//   className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
// >
//   {editingPoll ? "Update Poll" : "Create Poll"}
// </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Polls Container */}
//       <div className="bg-white rounded-lg shadow-sm border">
//         <div className="p-6 border-b border-gray-200 flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800 mb-1">Polls</h1>
//             <p className="text-gray-600">Participate in community polls and make your voice heard.</p>
//           </div>
//           <button 
//             onClick={() => setShowCreateModal(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
//           >
//             <Plus className="h-4 w-4" />
//             Create Poll
//           </button>
//         </div>

//         {/* new 2*/}
//           <div className="border-b border-gray-200">
//   <div className="flex items-center">
//     {/* Tabs */}
//     <div className="flex">
//       {tabs.map((tab) => (
//         <button
//           key={tab}
//           onClick={() => setActiveTab(tab)}
//           className={`px-6 py-3 text-sm font-medium transition-colors relative ${
//             activeTab === tab
//               ? 'text-blue-600 bg-blue-50'
//               : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
//           }`}
//         >
//           {tab}
//           {activeTab === tab && (
//             <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
//           )}
//         </button>
//       ))}
//     </div>
//     {/* Location Filter Dropdown */}
//     <div className="ml-auto flex items-center gap-2">
//       <span className="text-gray-700 font-medium">Location:</span>
//       <select
//         value={selectedLocation}
//         onChange={e => setSelectedLocation(e.target.value)}
//         className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//       >
//         {allLocations.map(loc => (
//           <option key={loc} value={loc}>{loc}</option>
//         ))}
//       </select>
//     </div>
//   </div>
// </div>
//         {/* new 2 */}
//         {/* new */}
//        {/*   <div className="mb-6 flex items-center gap-3">
//   <span className="text-gray-700 font-medium">Filter by Location:</span>
//   <select
//     value={selectedLocation}
//     onChange={e => setSelectedLocation(e.target.value)}
//     className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
//   >
//     {allLocations.map(loc => (
//       <option key={loc} value={loc}>{loc}</option>
//     ))}
//   </select>
// </div> */}
//         {/* new */}

//         <div className="p-8">
//           {filteredPolls.length === 0 ? (
//             <div className="text-center">
//               <div className="text-gray-500 mb-4">No polls found with the current filters.</div>
//               <button 
//                 onClick={() => setActiveTab('Active Polls')}
//                 className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {filteredPolls.map((poll) => (
//                 <div key={poll.id} className="bg-gray-50 p-6 rounded-lg border">
//                   <div className="flex justify-between items-start mb-4">
//                     <h3 className="text-lg font-semibold text-gray-800">{poll.question}</h3>
//                     <div className="flex gap-2">
//     {poll.isMyPoll && (
//       <div className="flex gap-2 items-center">
//         <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold shadow-md border-2 border-blue-400 flex items-center justify-center">
//           Your Poll
//         </span>
       
// <button
//   onClick={() => handleEditPoll(poll)}
//   className="bg-yellow-400 text-white px-4 py-2 rounded-full font-bold shadow-md border-2 border-yellow-600 hover:bg-yellow-500 hover:scale-105 transition-all duration-150 flex items-center gap-2"
// >
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m2 2l-6 6m2 2l-6 6" /></svg>
//   Edit
// </button>
// <button
//   onClick={() => handleDeletePoll(poll.id)}
//   className="bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-md border-2 border-red-700 hover:bg-red-600 hover:scale-105 transition-all duration-150 flex items-center gap-2"
// >
//   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
//   Delete
// </button>

//       </div>
//     )}
//                       <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-bold shadow-md border-2 border-gray-400 flex items-center justify-center">
//                         {poll.location}
//                       </span>
//                     </div>
//                   </div>
//                   {poll.description && (
//                     <p className="text-gray-600 mb-4">{poll.description}</p>
//                   )}

                  

//                   <div className="space-y-2 mb-4">
//                     {poll.options.map((option, index) => (
//                       <div key={index}>
//                         <button
//                           onClick={() => voteOnPoll(poll.id, index)}
//                           disabled={poll.hasVoted}
//                           className={`w-full text-left p-3 rounded-lg border transition-colors ${
//                             poll.hasVoted 
//                               ? 'bg-white cursor-not-allowed' 
//                               : 'bg-white hover:bg-blue-50 hover:border-blue-300'
//                           }`}
//                         >
//                           <div className="flex justify-between items-center">
//                             <span>{option}</span>
//                             {poll.hasVoted && (
//                               <div className="flex items-center gap-2">
//                                 <div className="w-20 bg-gray-200 rounded-full h-2">
//                                   <div 
//                                     className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                                     style={{ 
//                                       width: `${poll.totalVotes > 0 ? (poll.votes[index] / poll.totalVotes) * 100 : 0}%` 
//                                     }}
//                                   ></div>
//                                 </div>
//                                 <span className="text-sm text-gray-600">{poll.votes[index]}</span>
//                               </div>
//                             )}
//                           </div>
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="flex justify-between text-sm text-gray-500">
//                     <span>Closes on: {new Date(poll.closesOn).toLocaleDateString()}</span>
//                     <span>Total votes: {poll.totalVotes}</span>
//                   </div>
//                   {poll.hasVoted && (
//                     <div className="mt-2 text-sm text-green-600 font-medium">
//                       ✓ You have voted on this poll
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Call to Action Section */}
//       <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 border border-purple-200">
//         <div className="text-center">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">
//             Have a questions for your community?
//           </h3>
//           <p className="text-gray-600 mb-4">
//             Create a poll to gather input and understand public sentiment on local issues.
//           </p>
//         </div>
//       </div>

//     </div>
//     </>
//   );
// };

// export default Polls;








  import axios from "axios";
import { Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
interface Poll {
  id: string;
  question: string;
  description: string;
  options: string[];
  closesOn: string;
  votes: number[];
  totalVotes: number;
  hasVoted: boolean;
  location: string;
  isMyPoll: boolean;
  isOfficial?: boolean;
  createdBy?: {
    fullName: string;
    role: string;};
}
interface ToastModalProps {
  message: string;
  onClose: () => void;
  show: boolean;
  type?: "success" | "error";
}

const ToastModal: React.FC<ToastModalProps> = ({ message, onClose, show, type = "success" }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2000);
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
const Polls: React.FC = () => {
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [activeTab, setActiveTab] = useState('Active Polls');


  // Form state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollDescription, setPollDescription] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollLocation, setPollLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [locationError, setLocationError] = useState('');
  const [closesOn, setClosesOn] = useState('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type?: "success" | "error" }>({ show: false, message: "", type: "success" });
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const tabs = ['Active Polls', 'Polls I Voted On', 'My Polls'];/* new */


  useEffect(() => {
  const currentUserId = localStorage.getItem("userId");
  axios.get("http://localhost:5000/api/polls")
    .then(async res => {
        let polls = res.data.map((poll: any) => ({
        id: poll._id,
        question: poll.title,
        description: poll.description,
        options: poll.options.map((o: any) => o.text),
        closesOn: poll.closeDate,
        votes: poll.options.map((o: any) => o.votes),
        totalVotes: poll.options.reduce((sum: number, o: any) => sum + o.votes, 0),
        hasVoted: false,
        location: poll.targetLocation || '',
        // normalize creator id (works for populated object, mongoose id getter, or plain id string)
        isMyPoll: String(
          poll.createdBy && (typeof poll.createdBy === 'object'
            ? (poll.createdBy._id || poll.createdBy.id || poll.createdBy)
            : poll.createdBy)
        ) === String(currentUserId),
        // ensure createdBy is an object so UI can safely access .role/.fullName when populated
        createdBy: (poll.createdBy && typeof poll.createdBy === 'object') ? poll.createdBy : { _id: poll.createdBy },
        // backend may provide an explicit isOfficial flag; use it to render the badge when createdBy isn't populated
        isOfficial: !!poll.isOfficial
      }));
       console.log("currentUserId:", currentUserId);
      console.log("polls:", polls.map((p: any) => ({
        id: p.id,
        createdBy: p.createdBy,
        isMyPoll: p.isMyPoll
      })));

      // Fetch voted poll IDs for this user
      if (currentUserId) {
        const votedRes = await axios.get(`http://localhost:5000/api/polls/voted?userId=${currentUserId}`);
        const votedPollIds = votedRes.data;
        polls = polls.map((poll: any) => ({
          ...poll,
          hasVoted: votedPollIds.includes(poll.id)
        }));
      }
      setPolls(polls);
    })
    .catch(err => console.error("Error fetching polls:", err));
}, []);

  const addOption = () => {
    if (pollOptions.length < 10) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removeOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };
  
  /* new */
  const allLocations = [
  "All Locations",
  ...Array.from(new Set(polls.map((poll) => poll.location).filter(Boolean)))
];

  const updateOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };
  const fetchPolls = async () => {
  const currentUserId = localStorage.getItem("userId");
  const res = await axios.get("http://localhost:5000/api/polls");
  let polls = res.data.map((poll: any) => ({
    id: poll._id,
    question: poll.title,
    description: poll.description,
    options: poll.options.map((o: any) => o.text),
    closesOn: poll.closeDate,
    votes: poll.options.map((o: any) => o.votes),
    totalVotes: poll.options.reduce((sum: number, o: any) => sum + o.votes, 0),
    hasVoted: false,
    location: poll.targetLocation || 'San Diego, CA',
   /*  isMyPoll: poll.createdBy === currentUserId */
   /* new 4:20 25-09-25  */
    isMyPoll: String(
      poll.createdBy && (typeof poll.createdBy === 'object'
        ? (poll.createdBy._id || poll.createdBy.id || poll.createdBy)
        : poll.createdBy)
    ) === String(currentUserId),
    createdBy: (poll.createdBy && typeof poll.createdBy === 'object') ? poll.createdBy : { _id: poll.createdBy },
    isOfficial: !!poll.isOfficial
  }));
  if (currentUserId) {
    const votedRes = await axios.get(`http://localhost:5000/api/polls/voted?userId=${currentUserId}`);
    const votedPollIds = votedRes.data;
    polls = polls.map((poll: any) => ({
      ...poll,
      hasVoted: votedPollIds.includes(poll.id)
    }));
  }
  setPolls(polls);
};

  // Updated createPoll to send data to backend
  const createPoll = async () => {
 
    const userId = localStorage.getItem("userId");
  if (!userId) {
    setToast({ show: true, message: "You must be logged in to create a poll.", type: "error" });
    return;
  }
  /* new */
  if (!pollLocation.trim()) {
    setToast({ show: true, message: "Location is required!", type: "error" });
    return;
  }
  else {
    setLocationError('');
  }
  /* new */
    const pollData = {
      title: pollQuestion.trim(),
      description: pollDescription.trim(),
      options: pollOptions.filter(opt => opt.trim()),
      targetLocation: pollLocation.trim(), // or make dynamic
      createdBy: userId, // replace with real user id if available
      closeDate: closesOn,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/polls", pollData);
       await fetchPolls();
      // Add the new poll to the list (optional: refetch all polls instead)
      setPolls([
        {
          id: res.data._id,
          question: res.data.title,
          description: res.data.description,
          options: res.data.options.map((o: any) => o.text),
          closesOn: res.data.closeDate,
          votes: res.data.options.map((o: any) => o.votes),
          totalVotes: res.data.options.reduce((sum: number, o: any) => sum + o.votes, 0),
          hasVoted: false,
          location: res.data.targetLocation || 'San Diego, CA',
          isMyPoll: true
        },
        ...polls
      ]);
      // Reset form
      setPollQuestion('');
      setPollDescription('');
      setPollOptions(['', '']);
      setPollLocation('');
      setClosesOn('');
      setShowCreateModal(false);
 
setToast({ show: true, message: "Poll created successfully! 🎉", type: "success" });

    } catch (err: any) {
    
setToast({ show: true, message: "Error: " + (err.response?.data?.error || err.message), type: "error" });
    }
  };


    const voteOnPoll = async (pollId: string, optionIndex: number) => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    setToast({ show: true, message: "You must be logged in to vote.", type: "error" });
    return;
  }
  try {
    await axios.post(`http://localhost:5000/api/polls/${pollId}/vote`, {
      userId,
      selectedOption: optionIndex
    });
  await fetchPolls(); // <-- This makes the UI update instantly!
  setToast({ show: true, message: "Vote submitted!", type: "success" });
    // Refetch polls or update local states
    // ...rest of your code...
  } catch (err: any) {
    setToast({ show: true, message: "Error voting: " + (err.response?.data?.error || err.message), type: "error" });
  }
};
  /* const getFilteredPolls = () => {
    switch (activeTab) {
      case 'Active Polls':
        return polls;
      case 'Polls I Voted On':
        return polls.filter(poll => poll.hasVoted);
      case 'My Polls':
        return polls.filter(poll => poll.isMyPoll);
      case 'San Diego, CA':
        return polls.filter(poll => poll.location === 'San Diego, CA');
      default:
        return polls;
    }
  }; */
  /* new */
   const getFilteredPolls = () => {
  let filtered = polls;
  switch (activeTab) {
    case 'Active Polls':
      break;
    case 'Polls I Voted On':
      filtered = filtered.filter(poll => poll.hasVoted);
      break;
    case 'My Polls':
      filtered = filtered.filter(poll => poll.isMyPoll);
      break;
    default:
      break;
  }
  if (selectedLocation !== "All Locations") {
    filtered = filtered.filter(poll => poll.location === selectedLocation);
  }
  return filtered;
};
  /* new */
  const filteredPolls = getFilteredPolls();

  // ...rest of your component (JSX) remains unchanged...


  // Handle edit button click
const handleEditPoll = (poll: Poll) => {
  setEditingPoll(poll);
  setShowCreateModal(true);
  setPollQuestion(poll.question);
  setPollDescription(poll.description);
  setPollOptions([...poll.options]);
   setPollLocation(poll.location);
  setClosesOn(poll.closesOn.split('T')[0]); // format date if needed
};

// Handle update poll
const handleUpdatePoll = async () => {
  if (!editingPoll) return;
  const pollData = {
    title: pollQuestion.trim(),
    description: pollDescription.trim(),
    options: pollOptions.filter(opt => opt.trim()),
    targetLocation: pollLocation.trim(),
    closeDate: closesOn,
  };
  try {
    const res = await axios.put(`http://localhost:5000/api/polls/${editingPoll.id}`, pollData);
    await fetchPolls();
  
    setPolls(polls.map(p =>
  p.id === editingPoll.id
    ? {
        ...p,
        question: res.data.poll.title,
        description: res.data.poll.description,
        options: res.data.poll.options.map((o: any) => o.text),
        closesOn: res.data.poll.closeDate,
        location: res.data.poll.targetLocation
      }
    : p
));
    setEditingPoll(null);
    setShowCreateModal(false);
    setPollQuestion('');
    setPollDescription('');
    setPollOptions(['', '']);
    setPollLocation('');
    setClosesOn('');
 
setToast({ show: true, message: "Poll updated successfully! ✨", type: "success" });
  } catch (err: any) {
   
setToast({ show: true, message: "Error: " + (err.response?.data?.error || err.message), type: "error" });
  }
};
const handleCloseModal = () => {
  setShowCreateModal(false);
  setEditingPoll(null);
  setPollQuestion('');
  setPollDescription('');
  setPollOptions(['', '']);
  /* new */
  setLocationError('');

  setClosesOn('');
};
// Handle delete poll
const handleDeletePoll = async (pollId: string) => {
  if (!window.confirm("Are you sure you want to delete this poll?")) return;
  try {
    await axios.delete(`http://localhost:5000/api/polls/${pollId}`);
    await fetchPolls();
    setPolls(polls.filter(p => p.id !== pollId));
    
setToast({ show: true, message: "Poll deleted successfully! 🗑️", type: "success" });
  } catch (err: any) {
 
setToast({ show: true, message: "Error: " + (err.response?.data?.error || err.message), type: "error" });
  }
   
};


  return (
     <>


     <ToastModal
      show={toast.show}
      message={toast.message}
      type={toast.type}
      onClose={() => setToast({ ...toast, show: false })}
    />
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      {/* Create Poll Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Create a new poll</h2>
            
              <button 
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                   >
                <X className="h-6 w-6" />
                 </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">
                Create a new poll to gather community feedback on local issues
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poll Question
                </label>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="What do you want to ask the community?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Keep your question clear and specific.</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={pollDescription}
                  onChange={(e) => setPollDescription(e.target.value)}
                  placeholder="Provide more context about the poll..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Give community members enough information to make an informed choice.
                </p>
              </div>
              <div className="mb-6">
                {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                     Location
                </label>
                 <input
                 type="text"
                 value={pollLocation}
                 onChange={(e) => setPollLocation(e.target.value)}
                 placeholder="Enter location (e.g., San Diego, CA)"
                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                Specify the location relevant to this poll.
                </p> */}
                {/* new */}

                <label className="block text-sm font-medium text-gray-700 mb-2">
  Location <span className="text-red-500">*</span>
</label>
<input
  type="text"
  value={pollLocation}
  onChange={(e) => setPollLocation(e.target.value)}
  placeholder="Enter location (e.g., Delhi, Mumbai)"
  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  required
/>
{/* new */}
{locationError && (
  <p className="text-red-500 text-xs mt-1">{locationError}</p>
)}
{/* new */}
                {/* new */}
                </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poll Options
                  </label>
                  <div className="space-y-2">
                    {pollOptions.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {pollOptions.length > 2 && (
                          <button
                            onClick={() => removeOption(index)}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {pollOptions.length < 10 && (
                      <button
                        onClick={addOption}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 p-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Option
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Add at least 2 options, up to a maximum of 10
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Closes On
                  </label>
                  <input
                    type="date"
                    value={closesOn}
                    onChange={(e) => setClosesOn(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Choose when this poll will close
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-1 mt-0.5">
                    <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800 mb-1">Important information</h4>
                    <p className="text-sm text-green-700">
                      Polls should be designed to gather genuine community feedback on 
                      issues that affect your area. Polls that are misleading or 
                      designed to push a specific agenda may be removed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
              
                <button
  onClick={handleCloseModal}
  className="px-6 py-2 text-gray-600 hover:text-gray-800"
>
  Cancel
</button>
<button
  onClick={editingPoll ? handleUpdatePoll : createPoll}
  className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
>
  {editingPoll ? "Update Poll" : "Create Poll"}
</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Polls Container */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Polls</h1>
            <p className="text-gray-600">Participate in community polls and make your voice heard.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Poll
          </button>
        </div>

        {/* new 2*/}
          <div className="border-b border-gray-200">
  <div className="flex items-center">
    {/* Tabs */}
    <div className="flex">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === tab
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          {tab}
          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
      ))}
    </div>
    {/* Location Filter Dropdown */}
    <div className="ml-auto flex items-center gap-2">
      <span className="text-gray-700 font-medium">Location:</span>
      <select
        value={selectedLocation}
        onChange={e => setSelectedLocation(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
      >
        {allLocations.map(loc => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>
    </div>
  </div>
</div>
        {/* new 2 */}
        {/* new */}
        {/*  <div className="mb-6 flex items-center gap-3">
  <span className="text-gray-700 font-medium">Filter by Location:</span>
  <select
    value={selectedLocation}
    onChange={e => setSelectedLocation(e.target.value)}
    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
  >
    {allLocations.map(loc => (
      <option key={loc} value={loc}>{loc}</option>
    ))}
  </select>
</div> */}

        {/* new */}

        <div className="p-8">
          {filteredPolls.length === 0 ? (
            <div className="text-center">
              <div className="text-gray-500 mb-4">No polls found with the current filters.</div>
              <button 
                onClick={() => setActiveTab('Active Polls')}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPolls.map((poll) => (
                <div key={poll.id} className="bg-gray-50 p-6 rounded-lg border">
                  <div className="flex justify-between items-start mb-4">
{/*                     <h3 className="text-lg font-semibold text-gray-800">{poll.question}</h3> */}
                      {/* new 23-09-25 3:37 */}
                    {/*   <div className="flex items-center gap-2">
  <h3 className="text-lg font-semibold text-gray-800">{poll.question}</h3>
  {poll.createdBy?.role === "official" && (
    <span
      title="Official Poll"
      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold ml-2"
    >
      <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a1 1 0 01.894.553l1.382 2.764 3.05.444a1 1 0 01.554 1.706l-2.207 2.15.521 3.037a1 1 0 01-1.451 1.054L10 12.347l-2.743 1.441a1 1 0 01-1.451-1.054l.521-3.037-2.207-2.15a1 1 0 01.554-1.706l3.05-.444L9.106 2.553A1 1 0 0110 2z" />
      </svg>
      Official
    </span>
  )}
</div> */}
{/* new 23-09-25 3:54 */}
<div className="flex items-center gap-2 mb-2">
  <h3 className="text-lg font-semibold text-gray-800">{poll.question}</h3>
  {(poll.isOfficial || poll.createdBy?.role === "official") && (
    <span
      title="Official Poll"
      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold ml-2"
    >
      <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a1 1 0 01.894.553l1.382 2.764 3.05.444a1 1 0 01.554 1.706l-2.207 2.15.521 3.037a1 1 0 01-1.451 1.054L10 12.347l-2.743 1.441a1 1 0 01-1.451-1.054l.521-3.037-2.207-2.15a1 1 0 01.554-1.706l3.05-.444L9.106 2.553A1 1 0 0110 2z" />
      </svg>
      Official
    </span>
  )}
</div>
{/* new 2 23-05-25 3:54 */}
                       {/* new 23-09-25 3:37 */}


                    <div className="flex gap-2">
    {poll.isMyPoll && (
      <div className="flex gap-2 items-center">
        <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold shadow-md border-2 border-blue-400 flex items-center justify-center">
          Your Poll
        </span>
       
<button
  onClick={() => handleEditPoll(poll)}
  className="bg-yellow-400 text-white px-4 py-2 rounded-full font-bold shadow-md border-2 border-yellow-600 hover:bg-yellow-500 hover:scale-105 transition-all duration-150 flex items-center gap-2"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m2 2l-6 6m2 2l-6 6" /></svg>
  Edit
</button>
<button
  onClick={() => handleDeletePoll(poll.id)}
  className="bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-md border-2 border-red-700 hover:bg-red-600 hover:scale-105 transition-all duration-150 flex items-center gap-2"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
  Delete
</button>

      </div>
    )}
                      <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-bold shadow-md border-2 border-gray-400 flex items-center justify-center">
                        {poll.location}
                      </span>
                    </div>
                  </div>
                  {poll.description && (
                    <p className="text-gray-600 mb-4">{poll.description}</p>
                  )}

                  

                  <div className="space-y-2 mb-4">
                    {poll.options.map((option, index) => (
                      <div key={index}>
                        <button
                          onClick={() => voteOnPoll(poll.id, index)}
                          disabled={poll.hasVoted}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            poll.hasVoted 
                              ? 'bg-white cursor-not-allowed' 
                              : 'bg-white hover:bg-blue-50 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{option}</span>
                            {poll.hasVoted && (
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ 
                                      width: `${poll.totalVotes > 0 ? (poll.votes[index] / poll.totalVotes) * 100 : 0}%` 
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600">{poll.votes[index]}</span>
                              </div>
                            )}
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Closes on: {new Date(poll.closesOn).toLocaleDateString()}</span>
                    <span>Total votes: {poll.totalVotes}</span>
                  </div>
                  {poll.hasVoted && (
                    <div className="mt-2 text-sm text-green-600 font-medium">
                      ✓ You have voted on this poll
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 border border-purple-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Have a questions for your community?
          </h3>
          <p className="text-gray-600 mb-4">
            Create a poll to gather input and understand public sentiment on local issues.
          </p>
        </div>
      </div>

    </div>
    </>
  );
};

export default Polls;

















// import { BarChart3 } from 'lucide-react';
// import React from 'react';

// const Polls: React.FC = () => {
//   return (
//     <div className="flex-1 p-6">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">Polls</h1>
//         <p className="text-gray-600">Participate in community polls and see public opinion.</p>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//         <div className="bg-white p-6 rounded-lg shadow-sm border">
//           <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Polls</h3>
//           <div className="text-2xl font-bold text-blue-600">5</div>
//           <div className="text-sm text-gray-500">Available to vote</div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-sm border">
//           <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed Polls</h3>
//           <div className="text-2xl font-bold text-green-600">15</div>
//           <div className="text-sm text-gray-500">You participated</div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-sm border">
//           <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Votes</h3>
//           <div className="text-2xl font-bold text-purple-600">18</div>
//           <div className="text-sm text-gray-500">Total votes cast</div>
//         </div>
//       </div>

//       <div className="bg-white p-8 rounded-lg shadow-sm border">
//         <div className="text-center">
//           <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-700 mb-2">Community Polling</h3>
//           <p className="text-gray-500 mb-6">Participate in polls and help shape community decisions.</p>
//           <div className="flex gap-4 justify-center">
//             <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
//               Browse Active Polls
//             </button>
//             <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
//               View Results
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Polls;


