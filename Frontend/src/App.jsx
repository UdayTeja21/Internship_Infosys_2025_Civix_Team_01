import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import LandingPage from "./Pages/LandingPage";
import OfficialDashboard from "./Pages/OfficialDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/OfficialDashboard" element={<OfficialDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
