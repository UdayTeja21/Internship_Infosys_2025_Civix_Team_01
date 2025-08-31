import React from 'react';
import { 
  Home, 
  FileText, 
  BarChart3, 
  Users, 
  Settings,
  Edit,
  Vote,
  FileCheck
} from 'lucide-react';
import type { SidebarProps, MenuItem } from '../types';

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
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

  return (
    <div className="w-64 bg-green-50 border-r border-green-200 h-screen">
      <div className="p-6">
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

        <nav>
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
    </div>
  );
};

export default Sidebar;