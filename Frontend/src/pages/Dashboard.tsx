import React from 'react';
import type { Category, DashboardProps } from '../types';

const Dashboard: React.FC<DashboardProps> = ({ selectedCategory, setSelectedCategory }) => {
  const categories: Category[] = [
    { id: 'all', label: 'All Categories', color: 'gray' },
    { id: 'environment', label: 'Environment', color: 'purple' },
    { id: 'infrastructure', label: 'Infrastructure', color: 'blue' },
    { id: 'education', label: 'Education', color: 'green' },
    { id: 'public-safety', label: 'Public Safety', color: 'red' },
    { id: 'transportation', label: 'Transportation', color: 'yellow' },
  ];

  const getButtonClass = (category: Category) => {
    if (selectedCategory === category.id) {
      return `px-3 py-1 bg-${category.color}-200 text-${category.color}-800 rounded-full text-sm border-2 border-${category.color}-300`;
    }
    return `px-3 py-1 bg-${category.color}-100 text-${category.color}-700 rounded-full text-sm hover:bg-${category.color}-200`;
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Uday!</p>
        <p className="text-sm text-gray-500 mt-1">See what's happening in your community and make your voice heard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">My Petitions</h3>
          <div className="text-3xl font-bold text-gray-800">0</div>
          <div className="text-sm text-gray-500">Petitions</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Successful Petitions</h3>
          <div className="text-3xl font-bold text-gray-800">0</div>
          <div className="text-sm text-gray-500">or under review</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Active Petitions Near You</h3>
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Showing for San Diego, CA</div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={getButtonClass(category)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="text-center py-8 text-gray-500">
          <p>No Petitions found with the current filters</p>
          <button 
            onClick={() => setSelectedCategory('all')}
            className="text-blue-600 hover:text-blue-800 text-sm mt-2"
          >
            Clear Filters
          </button>
          <div className="mt-2 text-xs text-gray-400">
            Current filter: {categories.find(c => c.id === selectedCategory)?.label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;