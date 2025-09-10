import { Users } from 'lucide-react';
import React from 'react';

const Officials = () => {
  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Officials</h1>
        <p className="text-gray-600">Connect with your elected representatives and track their responses.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Local Officials</h3>
          <div className="text-2xl font-bold text-blue-600">8</div>
          <div className="text-sm text-gray-500">In your area</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Messages Sent</h3>
          <div className="text-2xl font-bold text-green-600">12</div>
          <div className="text-sm text-gray-500">To representatives</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Responses</h3>
          <div className="text-2xl font-bold text-purple-600">4</div>
          <div className="text-sm text-gray-500">Received replies</div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <div className="text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Representatives</h3>
          <p className="text-gray-500 mb-6">Connect with local, state, and federal representatives.</p>
          <div className="flex gap-4 justify-center">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              Find My Officials
            </button>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
              View Responses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Officials;