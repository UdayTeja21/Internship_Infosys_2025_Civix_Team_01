
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
  createdBy?: {
    fullName: string;
    role: string;
  };
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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-4 sm:p-6 flex flex-col items-center">
        <div className={`mb-3 sm:mb-4 text-3xl sm:text-4xl ${type === "success" ? "text-green-500" : "text-red-500"}`}>
          {type === "success" ? "✔️" : "❌"}
        </div>
        <div className="text-base sm:text-lg font-semibold text-gray-800 mb-2 text-center">{message}</div>
        <div className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 text-center">This popup will close automatically.</div>
        <button
          onClick={onClose}
          className={`px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto ${
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
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollDescription, setPollDescription] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollLocation, setPollLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [locationError, setLocationError] = useState('');
  const [closesOn, setClosesOn] = useState('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type?: "success" | "error" }>({ show: false, message: "", type: "success" });
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const tabs = ['Active Polls', 'Polls I Voted On', 'My Polls'];

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
          isMyPoll:
            (poll.createdBy && typeof poll.createdBy === "object" && String(poll.createdBy.id) === String(currentUserId)) ||
            (typeof poll.createdBy === "string" && String(poll.createdBy) === String(currentUserId)),
          createdBy: poll.createdBy
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
      isMyPoll:
        (poll.createdBy && typeof poll.createdBy === "object" && String(poll.createdBy.id) === String(currentUserId)) ||
        (typeof poll.createdBy === "string" && String(poll.createdBy) === String(currentUserId)),
      createdBy: poll.createdBy
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

  const createPoll = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setToastMessage("You must be logged in to create a poll.");
      setTimeout(() => setToastMessage(''), 2000);
      return;
    }

    if (!pollLocation.trim()) {
      setToastMessage("Location is required!");
      return;
    } else {
      setLocationError('');
    }

    const pollData = {
      title: pollQuestion.trim(),
      description: pollDescription.trim(),
      options: pollOptions.filter(opt => opt.trim()),
      targetLocation: pollLocation.trim(),
      createdBy: userId,
      closeDate: closesOn,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/polls", pollData);
      await fetchPolls();
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
      setToastMessage("You must be logged in to vote.");
      setTimeout(() => setToastMessage(''), 2000);
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/polls/${pollId}/vote`, {
        userId,
        selectedOption: optionIndex
      });
      await fetchPolls();
      setToastMessage("Vote submitted!");
      setTimeout(() => setToastMessage(''), 2000);
    } catch (err: any) {
      setToastMessage("Error voting: " + (err.response?.data?.error || err.message));
      setTimeout(() => setToastMessage(''), 2000);
    }
  };

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

  const filteredPolls = getFilteredPolls();

  const handleEditPoll = (poll: Poll) => {
    setEditingPoll(poll);
    setShowCreateModal(true);
    setPollQuestion(poll.question);
    setPollDescription(poll.description);
    setPollOptions([...poll.options]);
    setPollLocation(poll.location);
    setClosesOn(poll.closesOn.split('T')[0]);
  };

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
    setLocationError('');
    setClosesOn('');
  };

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
      
      <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
        {/* Create Poll Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  {editingPoll ? 'Edit Poll' : 'Create a new poll'}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <p className="text-sm text-gray-600 mb-4 sm:mb-6">
                  {editingPoll ? 'Update your poll details' : 'Create a new poll to gather community feedback on local issues'}
                </p>

                <div className="mb-4 sm:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poll Question
                  </label>
                  <input
                    type="text"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="What do you want to ask the community?"
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">Keep your question clear and specific.</p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={pollDescription}
                    onChange={(e) => setPollDescription(e.target.value)}
                    placeholder="Provide more context about the poll..."
                    rows={3}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Give community members enough information to make an informed choice.
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={pollLocation}
                    onChange={(e) => setPollLocation(e.target.value)}
                    placeholder="Enter location (e.g., Delhi, Mumbai)"
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    required
                  />
                  {locationError && (
                    <p className="text-red-500 text-xs mt-1">{locationError}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
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
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                          {pollOptions.length > 2 && (
                            <button
                              onClick={() => removeOption(index)}
                              className="p-2 text-red-500 hover:text-red-700 flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {pollOptions.length < 10 && (
                        <button
                          onClick={addOption}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 p-2 text-sm"
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
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Choose when this poll will close
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="bg-green-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                      <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800 mb-1 text-sm sm:text-base">Important information</h4>
                      <p className="text-xs sm:text-sm text-green-700">
                        Polls should be designed to gather genuine community feedback on 
                        issues that affect your area. Polls that are misleading or 
                        designed to push a specific agenda may be removed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 sm:px-6 py-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base flex-1 sm:flex-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingPoll ? handleUpdatePoll : createPoll}
                    className="bg-gray-800 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm sm:text-base flex-1 sm:flex-none"
                  >
                    {editingPoll ? "Update Poll" : "Create Poll"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Polls Container */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border">
          {/* Header Section */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Polls</h1>
                <p className="text-sm sm:text-base text-gray-600">Participate in community polls and make your voice heard.</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <Plus className="h-4 w-4" />
                Create Poll
              </button>
            </div>
          </div>

          {/* Tabs and Filters Section */}
          <div className="border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center">
              {/* Tabs */}
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
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
              <div className="p-3 sm:p-4 border-t sm:border-t-0 border-gray-200 sm:ml-auto">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium text-sm whitespace-nowrap">Location:</span>
                  <select
                    value={selectedLocation}
                    onChange={e => setSelectedLocation(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-auto"
                  >
                    {allLocations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Polls Content */}
          <div className="p-4 sm:p-6 md:p-8">
            {filteredPolls.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4 text-sm sm:text-base">No polls found with the current filters.</div>
                <button 
                  onClick={() => {
                    setActiveTab('Active Polls');
                    setSelectedLocation("All Locations");
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {filteredPolls.map((poll) => (
                  <div key={poll.id} className="bg-gray-50 p-4 sm:p-6 rounded-lg border">
                    {/* Poll Header */}
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800">{poll.question}</h3>
                          {poll.createdBy?.role === "official" && (
                            <span
                              title="Official Poll"
                              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a1 1 0 01.894.553l1.382 2.764 3.05.444a1 1 0 01.554 1.706l-2.207 2.15.521 3.037a1 1 0 01-1.451 1.054L10 12.347l-2.743 1.441a1 1 0 01-1.451-1.054l.521-3.037-2.207-2.15a1 1 0 01.554-1.706l3.05-.444L9.106 2.553A1 1 0 0110 2z" />
                              </svg>
                              Official
                            </span>
                          )}
                        </div>
                        
                        {/* Action Buttons for My Polls */}
                        {poll.isMyPoll && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold text-xs border-2 border-blue-400">
                              Your Poll
                            </span>
                            <button
                              onClick={() => handleEditPoll(poll)}
                              className="bg-yellow-400 text-white px-3 py-1 rounded-full font-bold text-xs border-2 border-yellow-600 hover:bg-yellow-500 transition-all duration-150 flex items-center gap-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m2 2l-6 6m2 2l-6 6" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePoll(poll.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-xs border-2 border-red-700 hover:bg-red-600 transition-all duration-150 flex items-center gap-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-bold text-xs border-2 border-gray-400 self-start lg:self-auto">
                        {poll.location}
                      </span>
                    </div>

                    {/* Poll Description */}
                    {poll.description && (
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">{poll.description}</p>
                    )}

                    {/* Poll Options */}
                    <div className="space-y-2 mb-4">
                      {poll.options.map((option, index) => (
                        <div key={index}>
                          <button
                            onClick={() => voteOnPoll(poll.id, index)}
                            disabled={poll.hasVoted}
                            className={`w-full text-left p-3 rounded-lg border transition-colors text-sm sm:text-base ${
                              poll.hasVoted 
                                ? 'bg-white cursor-not-allowed' 
                                : 'bg-white hover:bg-blue-50 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="break-words">{option}</span>
                              {poll.hasVoted && (
                                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                                  <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                      style={{ 
                                        width: `${poll.totalVotes > 0 ? (poll.votes[index] / poll.totalVotes) * 100 : 0}%` 
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-600 whitespace-nowrap">{poll.votes[index]}</span>
                                </div>
                              )}
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Poll Footer */}
                    <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-500 gap-2">
                      <span>Closes on: {new Date(poll.closesOn).toLocaleDateString()}</span>
                      <span>Total votes: {poll.totalVotes}</span>
                    </div>
                    
                    {poll.hasVoted && (
                      <div className="mt-2 text-xs sm:text-sm text-green-600 font-medium">
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
        <div className="mt-4 sm:mt-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 sm:p-6 border border-purple-200">
          <div className="text-center">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
              Have questions for your community?
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Create a poll to gather input and understand public sentiment on local issues.
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
            >
              Create Your First Poll
            </button>
          </div>
        </div>

        {/* Mobile Bottom Spacing */}
        <div className="h-4 sm:h-0"></div>
      </div>
    </>
  );
};

export default Polls;

















