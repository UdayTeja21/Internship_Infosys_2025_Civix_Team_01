import { useEffect, useState } from "react";

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

  // local form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const defaultProfileIcon =
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        
        if (!token) {
          throw new Error("No authentication token found. Please log in again.");
        }

        const response = await fetch("http://localhost:5000/api/settings/me", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

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

  // auto hide success after 3s
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  const handleInputChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
  };

  // Update profile using existing /api/settings/update route
  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await fetch("http://localhost:5000/api/settings/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          // Add profilePic here if you want to update it too
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      setSuccessMessage("Profile updated successfully!");
      setErrorMessage("");

    } catch (err) {
      console.error("❌ Profile update error:", err);
      setErrorMessage(`Profile update failed: ${err.message}`);
    }
  };

  // Update password using existing /api/settings/update-password route
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Frontend validation
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
      // Get token from localStorage
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      console.log("🔄 Sending password update request...");

      const response = await fetch("http://localhost:5000/api/settings/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      console.log("📡 Response status:", response.status);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error("❌ HTML response received:", text.substring(0, 200));
        throw new Error(`Server error: Received HTML instead of JSON. Status: ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      // Success - only show success if API call was successful
      setSuccessMessage("Password updated successfully!");
      setErrorMessage("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      console.log("✅ Password updated successfully!");

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
          <div className="bg-green-50 rounded-xl p-6 ">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Profile & Personal Information
            </h2>

            <div className="flex items-center gap-6 mb-8">
              <div className="relative w-24 h-24">
                <img
                  src={profilePic || defaultProfileIcon}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 bg-gray-100"
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {formData.fullName || "Loading..."}
                </h3>
                <p className="text-gray-500">{formData.email || "Loading..."}</p>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div className="mb-8">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                E-mail Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded">
                  ✓ VERIFIED
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleProfileUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="bg-green-50 rounded-xl p-6 ">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Security & Privacy
            </h2>
            {/* Changed to form with onSubmit */}
            <form onSubmit={handlePasswordUpdate}>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full mb-4 px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mb-4 px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                minLength="6"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mb-4 px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 focus:ring-2 focus:ring-violet-500"
              >
                Update Password
              </button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-green-50 ">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-100 border-l-4 border-green-500 text-green-800 px-6 py-3 rounded-lg shadow-md">
            {successMessage}
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="fixed top-5 right-5 z-50">
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-md">
            {errorMessage}
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-80 bg-green-50 p-6 shadow-sm">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
        <div className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionChange(item.id)}
              className={`w-full text-left p-4 rounded-xl transition-all hover:bg-gray-50 ${
                activeSection === item.id
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
                </div>
                <span className="text-gray-400">›</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-green-50 shadow-sm ">{renderContent()}</div>
    </div>
  );
};

export default OfficialSettings;