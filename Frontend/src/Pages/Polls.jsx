import { Plus, X } from 'lucide-react';
import React, { useState } from 'react';

const Polls = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [polls, setPolls] = useState([]);
  const [activeTab, setActiveTab] = useState('Active Polls');

  // Form state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollDescription, setPollDescription] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [closesOn, setClosesOn] = useState('');

  const tabs = ['Active Polls', 'Polls I Voted On', 'My Polls', 'San Diego, CA'];

  const addOption = () => {
    if (pollOptions.length < 10) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removeOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const createPoll = () => {
    if (!pollQuestion.trim() || !closesOn || pollOptions.filter(opt => opt.trim()).length < 2) {
      alert('Please fill in all required fields and provide at least 2 options.');
      return;
    }

    const newPoll = {
      id: Date.now().toString(),
      question: pollQuestion.trim(),
      description: pollDescription.trim(),
      options: pollOptions.filter(opt => opt.trim()),
      closesOn,
      votes: new Array(pollOptions.filter(opt => opt.trim()).length).fill(0),
      totalVotes: 0,
      hasVoted: false,
      location: 'San Diego, CA',
      isMyPoll: true
    };

    setPolls([newPoll, ...polls]);
    
    // Reset form
    setPollQuestion('');
    setPollDescription('');
    setPollOptions(['', '']);
    setClosesOn('');
    setShowCreateModal(false);
  };

  const voteOnPoll = (pollId, optionIndex) => {
    setPolls(polls.map(poll => {
      if (poll.id === pollId && !poll.hasVoted) {
        const newVotes = [...poll.votes];
        newVotes[optionIndex] += 1;
        return {
          ...poll,
          votes: newVotes,
          totalVotes: poll.totalVotes + 1,
          hasVoted: true
        };
      }
      return poll;
    }));
  };

  const getFilteredPolls = () => {
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
  };

  const filteredPolls = getFilteredPolls();

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      {/* Create Poll Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Create a new poll</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
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
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={createPoll}
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Create Poll
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

        <div className="border-b border-gray-200">
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
        </div>

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
                    <h3 className="text-lg font-semibold text-gray-800">{poll.question}</h3>
                    <div className="flex gap-2">
                      {poll.isMyPoll && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Your Poll
                        </span>
                      )}
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
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
  );
};

export default Polls;