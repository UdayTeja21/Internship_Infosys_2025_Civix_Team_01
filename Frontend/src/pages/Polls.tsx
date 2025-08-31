import { BarChart3 } from 'lucide-react';
import React from 'react';

const Polls: React.FC = () => {
  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Polls</h1>
        <p className="text-gray-600">Participate in community polls and see public opinion.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Polls</h3>
          <div className="text-2xl font-bold text-blue-600">5</div>
          <div className="text-sm text-gray-500">Available to vote</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed Polls</h3>
          <div className="text-2xl font-bold text-green-600">15</div>
          <div className="text-sm text-gray-500">You participated</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Votes</h3>
          <div className="text-2xl font-bold text-purple-600">18</div>
          <div className="text-sm text-gray-500">Total votes cast</div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Community Polling</h3>
          <p className="text-gray-500 mb-6">Participate in polls and help shape community decisions.</p>
          <div className="flex gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Browse Active Polls
            </button>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              View Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Polls;