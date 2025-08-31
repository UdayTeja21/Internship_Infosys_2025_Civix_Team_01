import { BarChart3, Vote } from 'lucide-react';
import React from 'react';

const ParticipatePolls: React.FC = () => {
  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Participate in Public Polls</h1>
        <p className="text-gray-600">Voice your opinion on important community issues.</p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <Vote className="h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Sample Community Poll</h3>
          <p className="text-gray-600 mb-4">Should the city invest in more public transportation?</p>
          
          <div className="space-y-3">
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="radio" name="poll1" className="mr-3" />
              <span className="text-gray-700">Yes, increase public transportation</span>
            </label>
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="radio" name="poll1" className="mr-3" />
              <span className="text-gray-700">No, focus on other priorities</span>
            </label>
            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="radio" name="poll1" className="mr-3" />
              <span className="text-gray-700">Undecided/Need more information</span>
            </label>
          </div>
          
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Submit Vote
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">More Polls Coming Soon</h3>
            <p className="text-gray-500 mb-4">Check back regularly for new community polls to participate in.</p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              View All Polls
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipatePolls;