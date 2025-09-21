import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart3, Vote } from 'lucide-react';

const ParticipatePolls = () => {
  const [polls, setPolls] = useState([]);
  const [votedPolls, setVotedPolls] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    const fetchPolls = async () => {
      const userId = localStorage.getItem("userId");
      const res = await axios.get("http://localhost:5000/api/polls");
      let pollsData = res.data.map((poll) => ({
        id: poll._id,
        question: poll.title,
        description: poll.description,
        options: poll.options.map((o) => o.text),
        votes: poll.options.map((o) => o.votes),
        totalVotes: poll.options.reduce((sum, o) => sum + o.votes, 0),
        hasVoted: false,
        location: poll.targetLocation || "",
        closesOn: poll.closeDate,
      }));
      if (userId) {
        const votedRes = await axios.get(`http://localhost:5000/api/polls/voted?userId=${userId}`);
        const votedPollIds = votedRes.data;
        pollsData = pollsData.map((poll) => ({
          ...poll,
          hasVoted: votedPollIds.includes(poll.id),
        }));
        setVotedPolls(votedPollIds);
      }
      setPolls(pollsData);
    };
    fetchPolls();
  }, []);
    const voteOnPoll = async (pollId, optionIndex) => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    setToast({ show: true, message: "You must be logged in to vote.", type: "error" });
    return;
  }
  try {
    await axios.post(`http://localhost:5000/api/polls/${pollId}/vote`, {
      userId,
      selectedOption: optionIndex,
    });
    setToast({ show: true, message: "Vote submitted!", type: "success" });

    // Fetch updated polls so UI is in sync
    const res = await axios.get("http://localhost:5000/api/polls");
    let pollsData = res.data.map((poll) => ({
      id: poll._id,
      question: poll.title,
      description: poll.description,
      options: poll.options.map((o) => o.text),
      votes: poll.options.map((o) => o.votes),
      totalVotes: poll.options.reduce((sum, o) => sum + o.votes, 0),
      hasVoted: false,
      location: poll.targetLocation || "",
      closesOn: poll.closeDate,
    }));
    const votedRes = await axios.get(`http://localhost:5000/api/polls/voted?userId=${userId}`);
    const votedPollIds = votedRes.data;
    pollsData = pollsData.map((poll) => ({
      ...poll,
      hasVoted: votedPollIds.includes(poll.id),
    }));
    setPolls(pollsData);
    setVotedPolls(votedPollIds);

    // Hide toast after 1.5s
    setTimeout(() => setToast({ ...toast, show: false }), 1500);
  } catch (err) {
    setToast({
      show: true,
      message: "Error voting: " + (err.response?.data?.error || err.message),
      type: "error",
    });
  }
};
    return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Participate in Public Polls</h1>
        <p className="text-gray-600">Voice your opinion on important community issues.</p>
      </div>
      <div className="space-y-6">
        {polls.length === 0 ? (
          <div className="text-gray-500">No polls available.</div>
        ) : (
          polls.map((poll) => (
            <div key={poll.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{poll.question}</h3>
              <p className="text-gray-600 mb-4">{poll.description}</p>
              <div className="space-y-3">
                {poll.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => voteOnPoll(poll.id, idx)}
                    disabled={poll.hasVoted}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      poll.hasVoted
                        ? "bg-white cursor-not-allowed"
                        : "bg-white hover:bg-blue-50 hover:border-blue-300"
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
                                width: `${
                                  poll.totalVotes > 0
                                    ? (poll.votes[idx] / poll.totalVotes) * 100
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{poll.votes[idx]}</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Location: {poll.location}</span>
                <span>Closes on: {poll.closesOn ? new Date(poll.closesOn).toLocaleDateString() : "N/A"}</span>
                <span>Total votes: {poll.totalVotes}</span>
              </div>
              {poll.hasVoted && (
                <div className="mt-2 text-sm text-green-600 font-medium">
                  ✓ You have voted on this poll
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {/* Toast */}
      {toast.show && (
  <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
    <div className={`p-6 rounded-xl shadow-2xl text-white text-lg font-bold pointer-events-auto
      ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
      {toast.message}
    </div>
  </div>
)}
    </div>
  );
};

export default ParticipatePolls;