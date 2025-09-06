import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CreatePetitions from './pages/CreatePetitions';
import Dashboard from './pages/Dashboard';
import Officials from './pages/Officials';
import ParticipatePolls from './pages/ParticipatePolls';
import Petitions from './pages/Petitions';
import Polls from './pages/Polls';
import SettingsPage from './pages/SettingsPage';
import TrackResponses from './pages/TrackResponses';

const DashboardLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />;
      case 'petitions':
        return <Petitions />;
      case 'polls':
        return <Polls />;
      case 'officials':
        return <Officials />;
      case 'settings':
        return <SettingsPage />;
      case 'create-petitions':
        return <CreatePetitions />;
      case 'participate-polls':
        return <ParticipatePolls />;
      case 'track-responses':
        return <TrackResponses />;
      default:
        return <Dashboard selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      {renderContent()}
    </div>
  );
};

export default DashboardLayout;