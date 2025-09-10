import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Fixed imports - make sure these match your actual component names
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';  // Changed from SignUpPage to SignupPage
import Dashboard from './pages/Dashboard';
import OfficialDashboard from './pages/OfficialDashboard';
import CreatePetitions from './pages/CreatePetitions';
import Polls from './pages/Polls';
import Officials from './pages/Officials';
import SettingsPage from './pages/SettingsPage';
import ParticipatePolls from './pages/ParticipatePolls';
import TrackResponses from './pages/TrackResponses';  // Fixed this too

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />  {/* Fixed component name */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/official-dashboard" element={<OfficialDashboard />} />
          <Route path="/create-petitions" element={<CreatePetitions />} />
          <Route path="/polls" element={<Polls />} />
          <Route path="/officials" element={<Officials />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/participate-polls" element={<ParticipatePolls />} />
          <Route path="/track-responses" element={<TrackResponses />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;