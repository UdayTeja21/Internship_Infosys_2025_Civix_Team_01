import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  FileText,
  BarChart,
  Users,
  Settings,
  PenTool,
  CheckSquare,
} from "lucide-react";

const Dashboard = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    { id: "all", label: "All Categories", color: "gray" },
    { id: "environment", label: "Environment", color: "purple" },
    { id: "infrastructure", label: "Infrastructure", color: "blue" },
    { id: "education", label: "Education", color: "green" },
    { id: "public-safety", label: "Public Safety", color: "red" },
    { id: "transportation", label: "Transportation", color: "yellow" },
  ];

  const getButtonClass = (category) => {
    if (selectedCategory === category.id) {
      return `px-3 py-1 bg-${category.color}-200 text-${category.color}-800 rounded-full text-sm border-2 border-${category.color}-300`;
    }
    return `px-3 py-1 bg-${category.color}-100 text-${category.color}-700 rounded-full text-sm hover:bg-${category.color}-200`;
  };

  return (
    <div className="flex min-h-screen bg-green-50">
      {/* Sidebar */}
      <div className="w-1/4 bg-green-100 p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
          🏛 CIVIX
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Digital Civic Engagement platform
        </p>
        <p className="text-xs text-gray-500 mb-6">
          Civix enables citizens to engage in local governance through petitions,
          voting and tracking officials responses.
        </p>

        <ul className="text-sm text-gray-700 space-y-4 mb-8">
          <li className="flex items-center gap-2">
            <PenTool className="w-4 h-4" /> Create and Sign Petitions
          </li>
          <li className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" /> Participate in Public Polls
          </li>
          <li className="flex items-center gap-2">
            <BarChart className="w-4 h-4" /> Track Official Responses
          </li>
        </ul>

        {/* Navigation Links */}
        <nav className="space-y-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 w-full px-3 py-2 bg-green-200 rounded-md"
          >
            <Home className="w-4 h-4" /> Dashboard
          </Link>
          <Link
          to="/create-petitions"
          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-green-200 rounded-md"
          >
          <FileText className="w-4 h-4" /> Petitions
          </Link>

          <Link
            to="/polls"
            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-green-200 rounded-md"
          >
            <BarChart className="w-4 h-4" /> Polls
          </Link>
          <Link
            to="/officials"
            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-green-200 rounded-md"
          >
            <Users className="w-4 h-4" /> Officials
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-green-200 rounded-md"
          >
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </nav>
      </div>

      {/* Main Dashboard */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">Welcome back, Sri!</p>
        <p className="text-sm text-gray-500 mt-1">
          See what's happening in your community and make your voice heard.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="bg-green-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              My Petitions
            </h3>
            <div className="text-3xl font-bold text-gray-800">0</div>
            <div className="text-sm text-gray-600">Petitions</div>
          </div>
          <div className="bg-green-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Successful Petitions
            </h3>
            <div className="text-3xl font-bold text-gray-800">0</div>
            <div className="text-sm text-gray-600">or under review</div>
          </div>
        </div>

        {/* Active Petitions */}
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Active Petitions Near You
          </h3>
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">
              Showing for San Diego, CA
            </div>
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

          <div className="text-center py-6 text-gray-500">
            <p>No Petitions found with the current filters</p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="text-green-700 hover:text-green-900 text-sm mt-2"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
