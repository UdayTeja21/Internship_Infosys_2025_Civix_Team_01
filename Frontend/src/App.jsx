import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import CreatePetitions from './pages/CreatePetitions';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './pages/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OfficialDashboard from './pages/OfficialDashboard';
import Officials from './pages/Officials';
import ParticipatePolls from './pages/ParticipatePolls';
import Petitions from './pages/Petitions';
import Polls from './pages/Polls';
import SettingsPage from './pages/SettingsPage';
import SignupPage from './pages/SignupPage';
import TrackResponses from './pages/TrackResponses';

function App() {
  const [userRole, setUserRole] = useState('');
  const [petitionStats, setPetitionStats] = useState({
    myPetitions: 0,
    signedPetitions: 0,
    activePetitions: 0,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      setUserRole(user.role);
    }
  }, []);

  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
         <Route path="/home" element={<LandingPage />} />       {/* ADDED */}
        <Route path="/features" element={<LandingPage />} />  {/* ADDED */}
        <Route path="/about" element={<LandingPage />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Citizen-only Protected Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout
                myPetitionsCount={petitionStats.myPetitions}
                signedPetitionsCount={petitionStats.signedPetitions}
                activePetitionsCount={petitionStats.activePetitions}
              />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="petitions" element={<Petitions />} />
          <Route path="polls" element={<Polls />} />
          <Route path="officials" element={<Officials />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="create-petitions" element={<CreatePetitions />} />
          <Route path="participate-polls" element={<ParticipatePolls />} />
          <Route path="track-responses" element={<TrackResponses />} />
        </Route>

        {/* Official-only Protected Route */}
        <Route
          path="/official-dashboard/*"
          element={
            <ProtectedRoute>
              <OfficialDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback for undefined routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;