// import React, { useState } from 'react';
// import Sidebar from './components/Sidebar';
// import Dashboard from './pages/Dashboard';
// import Petitions from './pages/Petitions';
// import Polls from './pages/Polls';
// import Officials from './pages/Officials';
// import SettingsPage from './pages/SettingsPage';
// import CreatePetitions from './pages/CreatePetitions';
// import ParticipatePolls from './pages/ParticipatePolls';
// import TrackResponses from './pages/TrackResponses';

// const App: React.FC = () => {
//   const [activeSection, setActiveSection] = useState<string>('dashboard');
//   const [selectedCategory, setSelectedCategory] = useState<string>('all');

//   const renderContent = () => {
//     switch (activeSection) {
//       case 'dashboard':
//         return <Dashboard selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />;
//       case 'petitions':
//         return <Petitions />;
//       case 'polls':
//         return <Polls />;
//       case 'officials':
//         return <Officials />;
//       case 'settings':
//         return <SettingsPage />;
//       case 'create-petitions':
//         return <CreatePetitions />;
//       case 'participate-polls':
//         return <ParticipatePolls />;
//       case 'track-responses':
//         return <TrackResponses />;
//       default:
//         return <Dashboard selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex">
//         <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// export default App;


import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignupPage';
import DashboardLayout from './pages/DashboardLayout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Always show LandingPage for root path */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Redirect to dashboard if already authenticated */}
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? 
            <LoginPage setIsAuthenticated={setIsAuthenticated} /> : 
            <Navigate to="/dashboard" replace />
          } 
        />
        <Route 
          path="/signup" 
          element={
            !isAuthenticated ? 
            <SignUpPage setIsAuthenticated={setIsAuthenticated} /> : 
            <Navigate to="/dashboard" replace />
          } 
        />
        
        {/* Protect dashboard routes */}
        <Route 
          path="/dashboard/*" 
          element={
            isAuthenticated ? 
            <DashboardLayout setIsAuthenticated={setIsAuthenticated} /> : 
            <Navigate to="/login" replace />
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;