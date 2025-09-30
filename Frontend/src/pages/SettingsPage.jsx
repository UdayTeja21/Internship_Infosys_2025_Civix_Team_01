

import { useState, useEffect } from "react";

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState("profile");

  // Profile picture states
  const [profilePic, setProfilePic] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Security states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Auto clear successMessage after 3 seconds
useEffect(() => {
  if (successMessage) {
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [successMessage]);


  


  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  // Notifications state (unused for now)
  const [petitionEmails, setPetitionEmails] = useState(true);

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

          // ✅ Store backend profilePic (string or null)
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

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result); // ✅ preview as base64
      };
      reader.readAsDataURL(file);
    }
  };

  // Update profile
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
          profilePic: profilePic, // ✅ backend must handle base64 or null
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


      // ✅ refresh local profilePic with saved value from backend
      setProfilePic(data.user?.profilePic || profilePic);

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

  // Remove profile picture
  const handleRemoveProfilePic = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/settings/remove-profile-pic",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  
    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.error || "Failed to remove profile picture");
      setSuccessMessage("");
      return;
    }

    // ✅ Success case
    setProfilePic(null);
    setSuccessMessage("Profile picture removed successfully");
    setErrorMessage("");

    // ✅ Auto-hide popup after 3s
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

  } catch (err) {
    console.error("❌ Error:", err);
    alert("Something went wrong. Try again.");
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

  // Default placeholder profile image
  const defaultProfileIcon =
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    // Handle sidebar section change
const handleSectionChange = (sectionId) => {
  setActiveSection(sectionId);
  setSuccessMessage(""); // clear old success messages
  setErrorMessage("");   // clear old error messages
};


  

  // Render content by section
  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="bg-green-50 rounded-xl p-6 w-full h-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                Profile & Personal Information
              </h2>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-20 h-20">
                <img
                  src={profilePic || defaultProfileIcon}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover cursor-pointer border-2 border-gray-200 bg-gray-100"
                  onClick={() => setShowModal(true)}
                />
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {formData.fullName}
                </h3>
                <p className="text-gray-500">{formData.email}</p>
              </div>
            </div>

            {/* Modal */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="relative text-center">
                  <img
                    src={profilePic || defaultProfileIcon}
                    alt="Profile Full"
                    className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg mx-auto bg-gray-100"
                  />
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg"
                  >
                    Close
                  </button>
                  <div className="flex gap-4 mt-6 justify-center">
                    <button
                      onClick={handleRemoveProfilePic}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Remove profilepic
                    </button>
                    <button
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      📁 Upload Photo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Info Form */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Personal Information
              </h3>
              <p className="text-gray-500 text-sm mb-6">
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
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 pr-20"
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
                      className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 pr-20 cursor-not-allowed"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded">
                      ✓ VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
              <button
                onClick={handleProfileUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="bg-green-50 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Security & Privacy
            </h2>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full mb-4 px-4 py-3 bg-gray-100 rounded-lg"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-4 px-4 py-3 bg-gray-100 rounded-lg"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-4 px-4 py-3 bg-gray-100 rounded-lg"
            />
            <button
              onClick={handlePasswordUpdate}
              className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Update Password
            </button>

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
    
    <div className="flex min-h-screen bg-green-50">

    {/* Success Message (center, auto disappear) */}
{/* Success Message (center popup, auto disappear in 3s) */}
{successMessage && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white border-l-4 border-green-500 shadow-xl rounded-xl px-6 py-4 flex items-center space-x-3 animate-fade-in-out">
      {/* Icon */}
      <svg
        className="w-7 h-7 text-green-500 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {/* Message */}
      <span className="text-green-700 font-semibold text-lg">
        {successMessage}
      </span>
    </div>
  </div>
)}
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


{/* Error Message (top-right, stays until changed) */}
<div className="fixed top-5 right-5 z-50">
  {errorMessage && (
    <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-md">
      {errorMessage}
    </div>
  )}
</div>


      {/* Sidebar */}
      <div className="w-80 bg-green-50 p-6 shadow-lg">
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
      <div className="flex-1 p-6">{renderContent()}</div>
    </div>
  );
};

export default SettingsPage;
