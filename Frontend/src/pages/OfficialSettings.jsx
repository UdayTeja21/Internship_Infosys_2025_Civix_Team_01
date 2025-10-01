// import { useEffect, useState } from "react";

// const sidebarItems = [
//   {
//     id: "profile",
//     icon: "👤",
//     title: "Profile & Personal Information",
//     subtitle: "Manage your profile and details",
//   },
//   {
//     id: "security",
//     icon: "🔒",
//     title: "Security & Privacy",
//     subtitle: "Change password and privacy settings",
//   },
// ];

// const OfficialSettings = () => {
//   const [activeSection, setActiveSection] = useState("profile");

//   // local form state
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//   });

//   const [profilePic, setProfilePic] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   // password state
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const defaultProfileIcon =
//     "https://cdn-icons-png.flaticon.com/512/847/847969.png";

//   // Fetch user data on component mount
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        
//         if (!token) {
//           throw new Error("No authentication token found. Please log in again.");
//         }

//         const response = await fetch("http://localhost:5000/api/settings/me", {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to fetch user data: ${response.status}`);
//         }

//         const userData = await response.json();
        
//         setFormData({
//           fullName: userData.fullName || "",
//           email: userData.email || "",
//         });
//         setProfilePic(userData.profilePic || null);

//       } catch (err) {
//         console.error("❌ Error fetching user data:", err);
//         setErrorMessage(`Failed to load profile: ${err.message}`);
//       }
//     };

//     fetchUserData();
//   }, []);

//   // auto hide success after 3s
//   useEffect(() => {
//     if (!successMessage) return;
//     const t = setTimeout(() => setSuccessMessage(""), 3000);
//     return () => clearTimeout(t);
//   }, [successMessage]);

//   const handleInputChange = (field, value) => {
//     setFormData((p) => ({ ...p, [field]: value }));
//   };

//   // Update profile using existing /api/settings/update route
//   const handleProfileUpdate = async () => {
//     try {
//       const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
//       if (!token) {
//         throw new Error("No authentication token found. Please log in again.");
//       }

//       const response = await fetch("http://localhost:5000/api/settings/update", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           fullName: formData.fullName,
//           // Add profilePic here if you want to update it too
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `Request failed with status ${response.status}`);
//       }

//       const data = await response.json();
      
//       setSuccessMessage("Profile updated successfully!");
//       setErrorMessage("");

//     } catch (err) {
//       console.error("❌ Profile update error:", err);
//       setErrorMessage(`Profile update failed: ${err.message}`);
//     }
//   };

//   // Update password using existing /api/settings/update-password route
//   const handlePasswordUpdate = async (e) => {
//     e.preventDefault();
    
//     // Clear previous messages
//     setErrorMessage("");
//     setSuccessMessage("");

//     // Frontend validation
//     if (!currentPassword || !newPassword || !confirmPassword) {
//       setErrorMessage("Fill all password fields");
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       setErrorMessage("New password and confirm password do not match");
//       return;
//     }
//     if (newPassword.length < 6) {
//       setErrorMessage("Password must be at least 6 characters");
//       return;
//     }

//     try {
//       // Get token from localStorage
//       const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
//       if (!token) {
//         throw new Error("No authentication token found. Please log in again.");
//       }

//       console.log("🔄 Sending password update request...");

//       const response = await fetch("http://localhost:5000/api/settings/update-password", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           currentPassword,
//           newPassword,
//           confirmPassword,
//         }),
//       });

//       console.log("📡 Response status:", response.status);

//       // Check if response is JSON
//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         const text = await response.text();
//         console.error("❌ HTML response received:", text.substring(0, 200));
//         throw new Error(`Server error: Received HTML instead of JSON. Status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || `Request failed with status ${response.status}`);
//       }

//       // Success - only show success if API call was successful
//       setSuccessMessage("Password updated successfully!");
//       setErrorMessage("");
//       setCurrentPassword("");
//       setNewPassword("");
//       setConfirmPassword("");
      
//       console.log("✅ Password updated successfully!");

//     } catch (err) {
//       console.error("❌ Password update error:", err);
//       setErrorMessage(`Password update failed: ${err.message}`);
//       setSuccessMessage("");
//     }
//   };

//   const handleSectionChange = (sectionId) => {
//     setActiveSection(sectionId);
//     setSuccessMessage("");
//     setErrorMessage("");
//   };

//   const renderContent = () => {
//     switch (activeSection) {
//       case "profile":
//         return (
//           <div className="bg-green-50 rounded-xl p-6 ">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//               Profile & Personal Information
//             </h2>

//             <div className="flex items-center gap-6 mb-8">
//               <div className="relative w-24 h-24">
//                 <img
//                   src={profilePic || defaultProfileIcon}
//                   alt="Profile"
//                   className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 bg-gray-100"
//                 />
//               </div>

//               <div>
//                 <h3 className="text-xl font-semibold text-gray-800">
//                   {formData.fullName || "Loading..."}
//                 </h3>
//                 <p className="text-gray-500">{formData.email || "Loading..."}</p>
//               </div>
//             </div>

//             <div className="mb-8">
//               <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 value={formData.fullName}
//                 onChange={(e) => handleInputChange("fullName", e.target.value)}
//                 className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter your full name"
//               />
//             </div>

//             <div className="mb-8">
//               <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
//                 E-mail Address
//               </label>
//               <div className="relative">
//                 <input
//                   type="email"
//                   value={formData.email}
//                   disabled
//                   className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 cursor-not-allowed"
//                 />
//                 <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded">
//                   ✓ VERIFIED
//                 </span>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <button
//                 onClick={handleProfileUpdate}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         );

//       case "security":
//         return (
//           <div className="bg-green-50 rounded-xl p-6 ">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//               Security & Privacy
//             </h2>
//             {/* Changed to form with onSubmit */}
//             <form onSubmit={handlePasswordUpdate}>
//               <input
//                 type="password"
//                 placeholder="Current Password"
//                 value={currentPassword}
//                 onChange={(e) => setCurrentPassword(e.target.value)}
//                 className="w-full mb-4 px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="New Password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="w-full mb-4 px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 required
//                 minLength="6"
//               />
//               <input
//                 type="password"
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="w-full mb-4 px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//               <button
//                 type="submit"
//                 className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 focus:ring-2 focus:ring-violet-500"
//               >
//                 Update Password
//               </button>
//             </form>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-green-50 ">
//       {/* Success Message */}
//       {successMessage && (
//         <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
//           <div className="bg-green-100 border-l-4 border-green-500 text-green-800 px-6 py-3 rounded-lg shadow-md">
//             {successMessage}
//           </div>
//         </div>
//       )}

//       {/* Error Message */}
//       {errorMessage && (
//         <div className="fixed top-5 right-5 z-50">
//           <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-md">
//             {errorMessage}
//           </div>
//         </div>
//       )}

//       {/* Sidebar */}
//       <div className="w-80 bg-green-50 p-6 shadow-sm">

//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
//         <div className="space-y-2">
//           {sidebarItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => handleSectionChange(item.id)}
//               className={`w-full text-left p-4 rounded-xl transition-all hover:bg-gray-50 ${
//                 activeSection === item.id
//                   ? "bg-blue-50 border-l-4 border-blue-500"
//                   : ""
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
//                   <span className="text-lg">{item.icon}</span>
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-gray-800 text-sm">
//                     {item.title}
//                   </h3>
//                   <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
//                 </div>
//                 <span className="text-gray-400">›</span>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6 bg-green-50 shadow-sm ">{renderContent()}</div>
//     </div>
//   );
// };

// export default OfficialSettings;


import { useEffect, useState } from "react";

// Eye Icon SVGs for password visibility
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
  </svg>
);


const sidebarItems = [
  {
    id: "profile",
    icon: "👤",
    title: "Profile & Personal Information",
    subtitle: "Manage your profile and details",
  },
  {
    id: "security",
    icon: "🔒",
    title: "Security & Privacy",
    subtitle: "Change password and privacy settings",
  },
];

const OfficialSettings = () => {
  const [activeSection, setActiveSection] = useState("profile");

  const [formData, setFormData] = useState({ fullName: "", email: "" });
  const [profilePic, setProfilePic] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const defaultProfileIcon = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found. Please log in again.");

        const response = await fetch("http://localhost:5000/api/settings/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`Failed to fetch user data: ${response.status}`);
        
        const userData = await response.json();
        setFormData({
          fullName: userData.fullName || "",
          email: userData.email || "",
        });
        setProfilePic(userData.profilePic || null);
      } catch (err) {
        console.error("❌ Error fetching user data:", err);
        setErrorMessage(`Failed to load profile: ${err.message}`);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  const handleInputChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
  };

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found. Please log in again.");

      const response = await fetch("http://localhost:5000/api/settings/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName: formData.fullName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }
      
      await response.json();
      setSuccessMessage("Profile updated successfully!");
      setErrorMessage("");
    } catch (err) {
      console.error("❌ Profile update error:", err);
      setErrorMessage(`Profile update failed: ${err.message}`);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found. Please log in again.");

      const response = await fetch("http://localhost:5000/api/settings/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Request failed with status ${response.status}`);

      setSuccessMessage("Password updated successfully!");
      setErrorMessage("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("❌ Password update error:", err);
      setErrorMessage(`Password update failed: ${err.message}`);
      setSuccessMessage("");
    }
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile & Personal Information</h2>
            <div className="flex items-center gap-6 mb-8">
              <div className="relative w-24 h-24">
                <img src={profilePic || defaultProfileIcon} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 bg-gray-100" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{formData.fullName || "Loading..."}</h3>
                <p className="text-gray-500">{formData.email || "Loading..."}</p>
              </div>
            </div>
            <div className="mb-8">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Full Name</label>
              <input type="text" value={formData.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500" placeholder="Enter your full name" />
            </div>
            <div className="mb-8">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">E-mail Address</label>
              <div className="relative">
                <input type="email" value={formData.email} disabled className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 cursor-not-allowed" />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded">✓ VERIFIED</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleProfileUpdate} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save Changes</button>
            </div>
          </>
        );
      case "security":
        return (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Security & Privacy</h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              {/* Current Password Field */}
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {showCurrentPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
              {/* New Password Field */}
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  minLength="6"
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {showNewPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
              {/* Confirm Password Field */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
              <button type="submit" className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 focus:ring-2 focus:ring-violet-500">
                Update Password
              </button>
            </form>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-green-70 p-4 md:p-6">
      {successMessage && <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"><div className="bg-green-100 border-l-4 border-green-500 text-green-800 px-6 py-3 rounded-lg shadow-md">{successMessage}</div></div>}
      {errorMessage && <div className="fixed top-5 right-5 z-50"><div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-md">{errorMessage}</div></div>}
      
      {/* Responsive Container: flex-col on mobile, md:flex-row on desktop */}
      <div className="flex flex-col md:flex-row w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Responsive Settings Sidebar */}
        <div className="w-full md:w-96 p-8 border-b md:border-b-0 md:border-r border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Settings</h1>
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <button key={item.id} onClick={() => handleSectionChange(item.id)} className={`w-full text-left p-4 rounded-xl transition-all hover:bg-gray-100 ${activeSection === item.id ? "bg-blue-50 border-l-4 border-blue-500 text-blue-800" : "text-gray-700"}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
                  </div>
                  <span className="text-gray-400 text-2xl">›</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default OfficialSettings;