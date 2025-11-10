
import { useState, useEffect } from "react";

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [profilePic, setProfilePic] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  const [petitionEmails, setPetitionEmails] = useState(true);

  // Auto clear successMessage after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/settings/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setFormData({
            fullName: data.fullName,
            email: data.email,
          });
          setProfilePic(data.profilePic || null);
        } else {
          console.error(data.error || "Failed to fetch user data");
        }
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update profile (removed profilePic from update)
  const handleProfileUpdate = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/settings/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          // profilePic removed from update
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || data.message || "Failed to update profile");
        setSuccessMessage("");
        return;
      }

      setSuccessMessage(data.message || "Profile updated successfully");
      setErrorMessage("");

    } catch (err) {
      console.error("❌ Error:", err);
      alert("Something went wrong. Try again.");
    }
  };

  // Update password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/settings/update-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Password updated successfully!");
        setErrorMessage("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage(data.error || "Failed to update password");
        setSuccessMessage("");
      }

    } catch (err) {
      console.error("❌ Error updating password:", err);
      alert("⚠️ Server error while updating password");
    }
  };

  // Sidebar items
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

  const defaultProfileIcon = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  // Handle sidebar section change
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setSuccessMessage("");
    setErrorMessage("");
    setShowMobileMenu(false); // Close mobile menu on section change
  };

  // Render content by section
  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="bg-green-50 rounded-xl p-4 sm:p-6 w-full h-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Profile & Personal Information
              </h2>
            </div>

            {/* Profile Section - Static Profile Icon */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <img
                  src={profilePic || defaultProfileIcon}
                  alt="Profile"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200 bg-gray-100"
                  // Removed onClick handler to disable popup
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  {formData.fullName}
                </h3>
                <p className="text-gray-500 text-sm sm:text-base">{formData.email}</p>
              </div>
            </div>

            {/* Personal Info Form */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Personal Information
              </h3>
              <p className="text-gray-500 text-sm mb-4 sm:mb-6">
                Update your basic information here.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 border-0 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    E-mail Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 border-0 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 pr-20 cursor-not-allowed text-sm sm:text-base"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded">
                      ✓ VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 sm:pt-6 border-t">
              <button
                onClick={handleProfileUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base w-full sm:w-auto"
              >
                Save Changes
              </button>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="bg-green-50 rounded-xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Security & Privacy
            </h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm sm:text-base"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm sm:text-base"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg text-sm sm:text-base"
              />
              <button
                type="submit"
                className="bg-violet-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-violet-700 text-sm sm:text-base w-full sm:w-auto"
              >
                Update Password
              </button>
            </form>

            {passwordMessage && (
              <p className="mt-4 text-sm text-gray-600">{passwordMessage}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-green-50">
      {/* Success Message Popup */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-l-4 border-green-500 shadow-xl rounded-xl px-4 sm:px-6 py-3 sm:py-4 flex items-center space-x-2 sm:space-x-3 animate-fade-in-out max-w-sm sm:max-w-md w-full">
            <svg
              className="w-5 h-5 sm:w-7 sm:h-7 text-green-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-700 font-semibold text-sm sm:text-lg">
              {successMessage}
            </span>
          </div>
        </div>
      )}

      {/* Error Message */}
      <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-5 z-50">
        {errorMessage && (
          <div className="bg-red-100 text-red-800 px-3 sm:px-4 py-2 rounded-lg shadow-md text-sm sm:text-base">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-green-100 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Settings</h1>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMobileMenu(false)}>
          <div className="bg-white w-80 h-full p-6 transform transition-transform" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Settings Menu</h2>
              <button onClick={() => setShowMobileMenu(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
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
        </div>
      )}

      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:block w-80 bg-green-50 p-6 shadow-lg">
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
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: scale(0.95); }
            10% { opacity: 1; transform: scale(1); }
            90% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.95); }
          }
          .animate-fade-in-out {
            animation: fadeInOut 3s ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default SettingsPage;

