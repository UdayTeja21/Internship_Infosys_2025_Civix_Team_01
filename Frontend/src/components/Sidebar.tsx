// import {
//   BarChart3,
//   Edit,
//   FileCheck,
//   FileText,
//   Home,
//   LogOut,
//   Settings,
//   Users,
//   Vote
// } from 'lucide-react';
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import type { MenuItem, SidebarProps } from '../types';
 
// const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
//   const navigate = useNavigate();
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
 
//   const menuItems: MenuItem[] = [
//     { id: 'dashboard', label: 'Dashboard', icon: Home },
//     { id: 'petitions', label: 'Petitions', icon: FileText },
//     { id: 'polls', label: 'Polls', icon: BarChart3 },
//     { id: 'officials', label: 'Officials', icon: Users },
//     { id: 'settings', label: 'Settings', icon: Settings },
//   ];
 
//   const actionItems: MenuItem[] = [
//     { id: 'create-petitions', label: 'Create and Sign Petitions', icon: Edit },
//     { id: 'participate-polls', label: 'Participate in Public Polls', icon: Vote },
//     { id: 'track-responses', label: 'Track Official Responses', icon: FileCheck },
//   ];
 
//   const handleSignOut = () => {
//     setShowLogoutConfirm(true);
//   };
 
//   const confirmSignOut = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     localStorage.removeItem('userInfo');
//     localStorage.removeItem('userId');
//     navigate('/login');
//   };
 
//   const cancelSignOut = () => {
//     setShowLogoutConfirm(false);
//   };
 
//   return (
//     <>
//       {/* Centered Modal */}
//       {showLogoutConfirm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] flex flex-col items-center">
//             <span className="text-gray-800 mb-5 text-lg font-semibold">
//               Are you sure you want to sign out?
//             </span>
//             <div className="flex gap-3">
//               <button
//                 onClick={confirmSignOut}
//                 className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//               >
//                 Confirm
//               </button>
//               <button
//                 onClick={cancelSignOut}
//                 className="px-5 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
 
//   <div className="hidden lg:flex w-64 bg-green-50 border-r border-green-200 h-screen flex-col sticky top-0">
//         <div className="p-6 flex-1 overflow-y-auto">
//           <div className="mb-8">
//             <div className="flex items-center mb-2">
//               <div className="w-8 h-8 bg-green-600 rounded mr-2 flex items-center justify-center">
//                 <span className="text-white font-bold text-sm">C</span>
//               </div>
//               <h1 className="text-xl font-bold text-gray-800">CIVIX</h1>
//             </div>
//             <p className="text-sm text-gray-600">Digital Civic Engagement platform</p>
//           </div>
         
//           <div className="mb-6">
//             <p className="text-sm text-gray-600 mb-3">
//               Civix enables citizens to engage in local governance through petitions, voting and tracking officials responses.
//             </p>
//           </div>
//           <div className="mb-6">
//             {actionItems.map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveSection(item.id)}
//                 className={`w-full flex items-center mb-2 text-sm p-2 rounded-lg text-left transition-colors ${
//                   activeSection === item.id
//                     ? 'bg-green-100 text-green-800 font-medium'
//                     : 'text-gray-700 hover:bg-green-50'
//                 }`}
//               >
//                 <item.icon className="h-4 w-4 mr-2" />
//                 {item.label}
//               </button>
//             ))}
//           </div>
//           <nav className="mb-6">
//             {menuItems.map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveSection(item.id)}
//                 className={`w-full flex items-center px-3 py-2 mb-1 rounded-lg text-left transition-colors ${
//                   activeSection === item.id
//                     ? 'bg-green-100 text-green-800 font-medium'
//                     : 'text-gray-700 hover:bg-green-50'
//                 }`}
//               >
//                 <item.icon className="h-5 w-5 mr-3" />
//                 {item.label}
//               </button>
//             ))}
//           </nav>
//         </div>
//         <div className="p-4 border-t border-green-200 bg-green-50 sticky bottom-0">
//           <button
//             onClick={handleSignOut}
//             className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-red-700 hover:bg-red-50 transition-colors duration-200 border border-red-200 hover:border-red-300"
//           >
//             <LogOut className="h-4 w-4 mr-2" />
//             Sign Out
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };
 
// export default Sidebar;
import {
  BarChart3,
  Edit,
  FileCheck,
  FileText,
  Home,
  LogOut,
  Settings,
  Users,
  Vote
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MenuItem, SidebarProps } from '../types';

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'petitions', label: 'Petitions', icon: FileText },
    { id: 'polls', label: 'Polls', icon: BarChart3 },
    { id: 'officials', label: 'Officials', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const actionItems: MenuItem[] = [
    { id: 'create-petitions', label: 'Create and Sign Petitions', icon: Edit },
    { id: 'participate-polls', label: 'Participate in Public Polls', icon: Vote },
    { id: 'track-responses', label: 'Track Official Responses', icon: FileCheck },
  ];

  const handleSignOut = () => {
    setShowLogoutConfirm(true);
  };

  const confirmSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const cancelSignOut = () => {
    setShowLogoutConfirm(false);
  };

  const handleMenuItemClick = (itemId: string) => {
    setActiveSection(itemId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button - Simple version without Menu icon */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-md shadow-lg"
        onClick={() => setIsMobileOpen(true)}
      >
        {/* Simple hamburger icon using text */}
        <span className="text-white font-bold">☰</span>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => setIsMobileOpen(false)}
          />
          
          {/* Mobile Sidebar */}
          <div className="fixed left-0 top-0 h-full w-80 bg-green-50 overflow-y-auto">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-green-200">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded mr-2 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <h1 className="text-xl font-bold text-gray-800">CIVIX</h1>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-green-100 transition-colors"
              >
                <span className="text-gray-600 text-lg">✕</span>
              </button>
            </div>

            <div className="p-4">
              {/* Description */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">
                  Civix enables citizens to engage in local governance through petitions, voting and tracking officials responses.
                </p>
              </div>

              {/* ACTION ITEMS - MOBILE - This is the important part */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Quick Actions
                </h3>
                {actionItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`w-full flex items-center mb-2 text-sm p-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-green-100 text-green-800 font-medium'
                        : 'text-gray-700 hover:bg-green-50'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Regular Menu Items */}
              <nav className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Navigation
                </h3>
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`w-full flex items-center px-3 py-3 mb-1 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-green-100 text-green-800 font-medium'
                        : 'text-gray-700 hover:bg-green-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Sign Out Button - Mobile */}
              <div className="mt-8 pt-4 border-t border-green-200">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center px-3 py-3 rounded-lg text-red-700 hover:bg-red-50 transition-colors duration-200 border border-red-200 hover:border-red-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-green-50 border-r border-green-200 h-screen flex-col sticky top-0">
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-green-600 rounded mr-2 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">CIVIX</h1>
            </div>
            <p className="text-sm text-gray-600">Digital Civic Engagement platform</p>
          </div>
         
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">
              Civix enables citizens to engage in local governance through petitions, voting and tracking officials responses.
            </p>
          </div>

          {/* ACTION ITEMS - DESKTOP */}
          <div className="mb-6">
            {actionItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center mb-2 text-sm p-2 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-green-100 text-green-800 font-medium'
                    : 'text-gray-700 hover:bg-green-50'
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Regular Menu Items */}
          <nav className="mb-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-3 py-2 mb-1 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-green-100 text-green-800 font-medium'
                    : 'text-gray-700 hover:bg-green-50'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-green-200 bg-green-50 sticky bottom-0">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-red-700 hover:bg-red-50 transition-colors duration-200 border border-red-200 hover:border-red-300"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] flex flex-col items-center">
            <span className="text-gray-800 mb-5 text-lg font-semibold">
              Are you sure you want to sign out?
            </span>
            <div className="flex gap-3">
              <button
                onClick={confirmSignOut}
                className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
              <button
                onClick={cancelSignOut}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;