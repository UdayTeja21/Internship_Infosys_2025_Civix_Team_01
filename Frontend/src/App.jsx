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
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Citizen-only Protected Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <DashboardLayout />
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
          path="/official-dashboard"
          element={
            <ProtectedRoute allowedRoles={['official']}>
              <OfficialDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;