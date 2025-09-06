// import { BarChart3, Edit, FileText, LayoutDashboard, Settings, Users } from "lucide-react";
// import React, { useState } from "react";
// import CreatePetitions from "./CreatePetitions";
// import Dashboard from "./Dashboard";
// import Officials from "./Officials";
// import ParticipatePolls from "./ParticipatePolls";
// import Petitions from "./Petitions";
// import Polls from "./Polls";
// import SettingsPage from "./SettingsPage";

// const DashboardLayout: React.FC = () => {
//   const [activePage, setActivePage] = useState("dashboard");

//   const renderPage = () => {
//     switch (activePage) {
//       case "dashboard":
//         return <Dashboard selectedCategory="all" setSelectedCategory={() => {}} />;
//       case "petitions":
//         return <Petitions />;
//       case "polls":
//         return <Polls />;
//       case "participate-polls":
//         return <ParticipatePolls />;
//       case "officials":
//         return <Officials />;
//       case "create-petitions":
//         return <CreatePetitions />;
//       case "settings":
//         return <SettingsPage />;
//       default:
//         return <Dashboard selectedCategory="all" setSelectedCategory={() => {}} />;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-md border-r">
//         <div className="p-6 font-bold text-xl text-green-600">Civic Portal</div>
//         <nav className="space-y-2 px-4">
//           <button
//             onClick={() => setActivePage("dashboard")}
//             className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left ${
//               activePage === "dashboard" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
//             }`}
//           >
//             <LayoutDashboard size={18} /> Dashboard
//           </button>

//           <button
//             onClick={() => setActivePage("petitions")}
//             className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left ${
//               activePage === "petitions" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
//             }`}
//           >
//             <FileText size={18} /> Petitions
//           </button>

//           <button
//             onClick={() => setActivePage("polls")}
//             className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left ${
//               activePage === "polls" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
//             }`}
//           >
//             <BarChart3 size={18} /> Polls
//           </button>

//           <button
//             onClick={() => setActivePage("participate-polls")}
//             className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left ${
//               activePage === "participate-polls" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
//             }`}
//           >
//             <BarChart3 size={18} /> Participate Polls
//           </button>

//           <button
//             onClick={() => setActivePage("officials")}
//             className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left ${
//               activePage === "officials" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
//             }`}
//           >
//             <Users size={18} /> Officials
//           </button>

//           <button
//             onClick={() => setActivePage("create-petitions")}
//             className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left ${
//               activePage === "create-petitions" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
//             }`}
//           >
//             <Edit size={18} /> Create Petition
//           </button>

//           <button
//             onClick={() => setActivePage("settings")}
//             className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left ${
//               activePage === "settings" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
//             }`}
//           >
//             <Settings size={18} /> Settings
//           </button>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <main className="flex-1">{renderPage()}</main>
//     </div>
//   );
// };

// export default DashboardLayout;



import { BarChart3, Edit, FileText, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

// Import all the components used in renderPage()
import CreatePetitions from "./CreatePetitions";
import Dashboard from "./Dashboard";
import Officials from "./Officials";
import ParticipatePolls from "./ParticipatePolls";
import Petitions from "./Petitions";
import Polls from "./Polls";
import SettingsPage from "./SettingsPage";

// Add this interface
interface DashboardLayoutProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

// Add User interface
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ setIsAuthenticated }) => {
  const [activePage, setActivePage] = useState("dashboard");
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        navigate("/login");
      });
  }, [navigate, setIsAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard selectedCategory="all" setSelectedCategory={() => {}} />;
      case "petitions": return <Petitions />;
      case "polls": return <Polls />;
      case "participate-polls": return <ParticipatePolls />;
      case "officials": return <Officials />;
      case "create-petitions": return <CreatePetitions />;
      case "settings": return <SettingsPage />;
      default: return <Dashboard selectedCategory="all" setSelectedCategory={() => {}} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md border-r flex flex-col">
        <div className="p-6 font-bold text-xl text-green-600">
          Civic Portal
          {user && <p className="text-sm text-gray-500">Hello, {user.role}</p>}
        </div>
        <nav className="space-y-2 px-4 flex-1">
          <button onClick={() => setActivePage("dashboard")}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left ${
              activePage === "dashboard" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
            }`}><LayoutDashboard size={18} /> Dashboard</button>
          <button onClick={() => setActivePage("petitions")}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left ${
              activePage === "petitions" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
            }`}><FileText size={18} /> Petitions</button>
          <button onClick={() => setActivePage("polls")}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left ${
              activePage === "polls" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
            }`}><BarChart3 size={18} /> Polls</button>
          <button onClick={() => setActivePage("participate-polls")}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left ${
              activePage === "participate-polls" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
            }`}><BarChart3 size={18} /> Participate Polls</button>
          <button onClick={() => setActivePage("officials")}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left ${
              activePage === "officials" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
            }`}><Users size={18} /> Officials</button>
          <button onClick={() => setActivePage("create-petitions")}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left ${
              activePage === "create-petitions" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
            }`}><Edit size={18} /> Create Petition</button>
          <button onClick={() => setActivePage("settings")}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left ${
              activePage === "settings" ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
            }`}><Settings size={18} /> Settings</button>
        </nav>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-800">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
      <main className="flex-1">{renderPage()}</main>
    </div>
  );
};

export default DashboardLayout;