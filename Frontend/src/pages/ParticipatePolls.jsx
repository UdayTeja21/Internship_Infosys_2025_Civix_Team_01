
import axios from "axios";
import { useEffect, useState } from "react";

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
    <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
          Participate in Public Polls
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Voice your opinion on important community issues.
        </p>
      </div>

      {/* Polls List */}
      <div className="space-y-4 sm:space-y-6">
        {polls.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-sm border">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📊</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              No polls available
            </h3>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
              Check back later for new community polls to participate in.
            </p>
          </div>
        ) : (
          polls.map((poll) => (
            <div key={poll.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              {/* Poll Header */}
              <div className="mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2 break-words">
                  {poll.question}
                </h3>
                {poll.description && (
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {poll.description}
                  </p>
                )}
              </div>

              {/* Poll Options */}
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                {poll.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => voteOnPoll(poll.id, idx)}
                    disabled={poll.hasVoted}
                    className={`w-full text-left p-2 sm:p-3 rounded-lg border transition-colors text-sm sm:text-base ${
                      poll.hasVoted
                        ? "bg-white cursor-not-allowed"
                        : "bg-white hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                      <span className="break-words flex-1">{option}</span>
                      {poll.hasVoted && (
                        <div className="flex items-center gap-2 w-full sm:w-auto mt-1 sm:mt-0">
                          <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2 flex-shrink-0">
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
                          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap flex-shrink-0">
                            {poll.votes[idx]} votes
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Poll Footer */}
              <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-500 gap-1 sm:gap-2">
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {poll.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {poll.closesOn ? new Date(poll.closesOn).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <span className="flex items-center gap-1 font-medium">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  {poll.totalVotes} total votes
                </span>
              </div>

              {/* Voted Indicator */}
              {poll.hasVoted && (
                <div className="mt-2 text-xs sm:text-sm text-green-600 font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  You have voted on this poll
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
          <div className={`p-4 sm:p-6 rounded-xl shadow-2xl text-white text-base sm:text-lg font-bold pointer-events-auto max-w-sm w-full text-center ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}>
            {toast.message}
          </div>
        </div>
      )}

      {/* Mobile Bottom Spacing */}
      <div className="h-4 sm:h-0"></div>
    </div>
  );
};

export default ParticipatePolls;