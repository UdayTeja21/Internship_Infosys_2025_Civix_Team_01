import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OfficialDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState({ petitions: 12, polls: 3 });
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Load user information on component mount
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    const userRole = localStorage.getItem('userRole');
    
    if (storedUserInfo && userRole === 'Public Official') {
      setUserInfo(JSON.parse(storedUserInfo));
    } else {
      // If user is not a public official or no user info, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setNotifications(prev => ({
          ...prev,
          petitions: prev.petitions + 1
        }));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleSignOut = () => {
    // Clear user data and redirect to home
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const respondToPetition = (id) => {
    alert(`Opening response interface for petition ${id}...`);
  };

  // If user info is not loaded yet, show loading
  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50">
        <div className="text-center">
          <div className="text-3xl text-green-800 mb-4">🏛️</div>
          <div className="text-xl font-bold text-green-800">Loading Official Dashboard...</div>
        </div>
      </div>
    );
  }

  // ✅ Safe firstName calculation
  const firstName = userInfo?.name ? userInfo.name.split(' ')[0] : 'Official';

  const petitions = [
    {
      id: 1,
      title: "Improve Street Lighting on Main Street",
      submitter: "Maria Rodriguez",
      signatures: 247,
      timeAgo: "3 days ago",
      status: "pending",
      priority: "high"
    },
    {
      id: 2,
      title: "Add More Bike Lanes in Downtown Area",
      submitter: "Green Commute Alliance",
      signatures: 423,
      timeAgo: "1 week ago",
      status: "under-review",
      priority: "medium"
    },
    {
      id: 3,
      title: "Extend Library Hours on Weekends",
      submitter: "Students United",
      signatures: 156,
      timeAgo: "2 weeks ago",
      status: "responded",
      priority: "low"
    },
    {
      id: 4,
      title: "Traffic Safety Measures Near Schools",
      submitter: "Parent Teacher Association",
      signatures: 534,
      timeAgo: "4 days ago",
      status: "pending",
      priority: "high"
    }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      'pending': { class: 'bg-yellow-100 text-yellow-700', text: 'Pending Review' },
      'under-review': { class: 'bg-blue-100 text-blue-700', text: 'Under Review' },
      'responded': { class: 'bg-green-100 text-green-700', text: 'Responded' }
    };
    return configs[status] || configs['pending'];
  };

  const getPriorityClass = (priority) => {
    const classes = {
      'high': 'border-l-4 border-red-500',
      'medium': 'border-l-4 border-yellow-500',
      'low': 'border-l-4 border-green-500'
    };
    return classes[priority] || '';
  };

  const quickActions = [
    { 
      icon: '📢', 
      title: 'Create Public Announcement', 
      desc: 'Share important updates with citizens', 
      action: () => alert('Opening announcement creation form...') 
    },
    { 
      icon: '📋', 
      title: 'Review Pending Petitions', 
      desc: '12 petitions awaiting your response', 
      action: () => alert('Navigating to petition review page...') 
    },
    { 
      icon: '🗳️', 
      title: 'Create Community Poll', 
      desc: 'Gather public opinion on issues', 
      action: () => alert('Opening poll creation interface...') 
    },
    { 
      icon: '📊', 
      title: 'View Engagement Analytics', 
      desc: 'Track community participation trends', 
      action: () => alert('Loading detailed analytics dashboard...') 
    },
    { 
      icon: '📅', 
      title: 'Schedule Town Hall', 
      desc: 'Plan community meetings', 
      action: () => alert('Opening meeting scheduler...') 
    }
  ];

  const navigationItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard', badge: null },
    { id: 'petitions', icon: '📝', label: 'Petitions', badge: notifications.petitions },
    { id: 'polls', icon: '📊', label: 'Polls', badge: notifications.polls },
    { id: 'feedback', icon: '💬', label: 'Community Feedback', badge: null },
    { id: 'analytics', icon: '📈', label: 'Analytics & Reports', badge: null },
    { id: 'announcements', icon: '📢', label: 'Public Announcements', badge: null },
    { id: 'engagement', icon: '👥', label: 'Citizen Engagement', badge: null },
    { id: 'settings', icon: '⚙️', label: 'Settings', badge: null }
  ];

  const stats = [
    { title: 'Pending Petitions', value: '12', change: '+3 from last week', icon: '📝', positive: true },
    { title: 'Active Polls', value: '3', change: '847 total responses', icon: '📊', positive: true },
    { title: 'Response Rate', value: '94%', change: '+5% this month', icon: '⚡', positive: true },
    { title: 'Community Satisfaction', value: '4.7', change: '+0.3 from last quarter', icon: '👍', positive: true }
  ];

  const filters = ['all', 'high-priority', 'urgent', 'overdue'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-b from-green-300 to-green-400 p-6 shadow-xl flex flex-col">
        {/* Logo */}
        <div className="flex items-center mb-8 text-green-800">
          <div className="text-3xl mr-3">🏛️</div>
          <div className="text-2xl font-bold">CIVIX</div>
        </div>
        
        <div className="text-green-800 text-sm mb-8 leading-relaxed">
          Digital Civic Engagement platform<br />
          Official Administrative Portal
        </div>

        {/* Official Profile */}
        <div className="bg-white bg-opacity-30 rounded-xl p-5 mb-8 backdrop-blur-sm">
          <div className="bg-green-800 text-white px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">
            VERIFIED OFFICIAL
          </div>
          <div className="text-lg font-bold text-green-800 mb-1">
            {userInfo?.name || 'Official User'}
          </div>
          <div className="text-green-700 text-sm mb-2">
            {userInfo?.email || 'No email available'}
          </div>
          <div className="text-green-700 text-xs flex items-center">
            📍 Connected via CIVIX Platform
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          {navigationItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center p-4 m-2 rounded-lg cursor-pointer transition-all duration-300 text-green-800 font-medium hover:bg-white hover:bg-opacity-40 hover:translate-x-1 ${
                activeTab === item.id ? 'bg-white bg-opacity-50 shadow-md' : ''
              }`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center ml-2">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="mt-8 pt-5 border-t border-white border-opacity-30">
          <div className="flex items-center p-4 m-2 rounded-lg cursor-pointer transition-all duration-300 text-green-800 font-medium hover:bg-white hover:bg-opacity-40">
            <span className="mr-3 text-lg">❓</span>
            Help & Support
          </div>
          <div 
            className="flex items-center p-4 m-2 rounded-lg cursor-pointer transition-all duration-300 text-green-800 font-medium hover:bg-white hover:bg-opacity-40"
            onClick={handleSignOut}
          >
            <span className="mr-3 text-lg">🚪</span>
            Sign Out
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header with Welcome Message */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-green-800">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {firstName}!
            </h1>
            <p className="text-gray-600 text-lg">
              Manage community engagement and respond to citizen concerns
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-green-100 text-green-800 border border-green-800 rounded-lg font-semibold hover:bg-green-800 hover:text-white transition-all duration-300 flex items-center gap-2">
              📊 Generate Report
            </button>
            <button className="px-6 py-3 bg-green-800 text-white rounded-lg font-semibold hover:bg-green-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center gap-2">
              📢 New Announcement
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300 border-l-4 border-green-400">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 text-sm font-medium">{stat.title}</span>
                <span className="text-2xl text-green-400">{stat.icon}</span>
              </div>
              <div className="text-3xl font-bold text-green-800 mb-1">{stat.value}</div>
              <div className={`text-xs ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                ↗ {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Petitions */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-green-800">Petitions Requiring Action</h2>
              <div className="flex gap-2 flex-wrap">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    className={`px-4 py-2 rounded-full text-xs transition-all duration-300 ${
                      activeFilter === filter
                        ? 'bg-green-800 text-white'
                        : 'bg-white text-green-800 border border-green-400 hover:bg-green-400 hover:text-green-800'
                    }`}
                    onClick={() => handleFilterClick(filter)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {petitions.map((petition) => {
                const statusConfig = getStatusConfig(petition.status);
                return (
                  <div key={petition.id} className={`flex justify-between items-start p-4 border-b border-gray-100 last:border-b-0 ${getPriorityClass(petition.priority)}`}>
                    <div className="flex-1">
                      <div className="font-semibold text-green-800 mb-1">{petition.title}</div>
                      <div className="text-xs text-gray-600 mb-2">
                        Submitted by {petition.submitter} • {petition.signatures} signatures • {petition.timeAgo}
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusConfig.class}`}>
                        {statusConfig.text}
                      </span>
                    </div>
                    <button
                      className={`ml-4 px-4 py-2 rounded-md text-xs font-semibold transition-all duration-300 ${
                        petition.status === 'responded'
                          ? 'bg-gray-500 text-white'
                          : 'bg-green-800 text-white hover:bg-green-700'
                      }`}
                      onClick={() => respondToPetition(petition.id)}
                    >
                      {petition.status === 'responded' ? 'View Response' : 
                       petition.status === 'under-review' ? 'Update Status' : 'Respond'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-green-800">Quick Actions</h2>
            </div>

            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-green-50 rounded-lg cursor-pointer transition-all duration-300 border border-transparent hover:bg-green-100 hover:border-green-400 hover:translate-x-1"
                  onClick={action.action}
                >
                  <span className="mr-3 text-green-800 text-xl">{action.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-green-800 mb-1">{action.title}</div>
                    <div className="text-xs text-gray-600">{action.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community Engagement Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-green-800">Community Engagement Overview</h2>
            <select className="p-2 border border-gray-300 rounded-md">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Last Year</option>
            </select>
          </div>
          
          <div className="bg-green-50 rounded-lg p-5 mb-5 text-center">
            <div className="h-32 bg-gradient-to-r from-green-400 to-green-300 rounded-lg flex items-center justify-center text-green-800 font-bold">
              📈 Engagement Trends Chart<br />
              <small className="font-normal">Petition submissions, poll participation, and community feedback over time</small>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-800">1,247</div>
              <div className="text-xs text-gray-600">Total Citizen Interactions</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-800">89%</div>
              <div className="text-xs text-gray-600">Citizen Satisfaction Rate</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-800">2.3</div>
              <div className="text-xs text-gray-600">Avg Response Time (days)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialDashboard;
