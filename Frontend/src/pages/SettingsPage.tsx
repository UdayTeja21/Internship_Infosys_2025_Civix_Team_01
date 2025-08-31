
const SettingsPage = () => {
  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences.</p>
      </div>

      {/* Account Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Account Information</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Location"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Notifications</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" defaultChecked />
            Email updates
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            New polls
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" defaultChecked />
            Weekly digest
          </label>
        </div>
      </div>

      {/* Save / Reset */}
      <div className="flex gap-3">
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          Save
        </button>
        <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
          Reset
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;





























































// import React from 'react';

// const SettingsPage: React.FC = () => {
//   return (
//     <div className="flex-1 p-6">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
//         <p className="text-gray-600">Manage your account and preferences.</p>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow-sm border">
//           <h3 className="text-lg font-semibold text-gray-700 mb-4">Account Information</h3>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//               <input 
//                 type="text" 
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="Sri Lastname"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <input 
//                 type="email" 
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="sri@example.com"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//               <input 
//                 type="text" 
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                 placeholder="San Diego, CA"
//               />
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg shadow-sm border">
//           <h3 className="text-lg font-semibold text-gray-700 mb-4">Notification Preferences</h3>
//           <div className="space-y-3">
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-3" defaultChecked />
//               <span className="text-sm text-gray-700">Email notifications for petition updates</span>
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-3" defaultChecked />
//               <span className="text-sm text-gray-700">New polls in your area</span>
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-3" />
//               <span className="text-sm text-gray-700">Official responses to your petitions</span>
//             </label>
//             <label className="flex items-center">
//               <input type="checkbox" className="mr-3" defaultChecked />
//               <span className="text-sm text-gray-700">Weekly community digest</span>
//             </label>
//           </div>
//         </div>
//       </div>
      
//       <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-700">Account Actions</h3>
//             <p className="text-sm text-gray-500">Manage your account settings</p>
//           </div>
//           <div className="flex gap-3">
//             <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
//               Save Changes
//             </button>
//             <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
//               Reset
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;