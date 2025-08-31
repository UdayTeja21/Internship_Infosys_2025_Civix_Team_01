import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Petitions from './pages/Petitions';
import Polls from './pages/Polls';
import Officials from './pages/Officials';
import SettingsPage from './pages/SettingsPage';
import CreatePetitions from './pages/CreatePetitions';
import ParticipatePolls from './pages/ParticipatePolls';
import TrackResponses from './pages/TrackResponses';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        {renderContent()}
      </div>
    </div>
  );
};

export default App;