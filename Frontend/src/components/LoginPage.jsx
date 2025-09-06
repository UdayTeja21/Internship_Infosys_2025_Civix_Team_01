import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function LoginPage({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleForgotPasswordChange = (e) => {
    setForgotPasswordData({
      ...forgotPasswordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      console.log("🔑 Attempting login with:", { email: formData.email });
      const response = await API.post("/auth/login", formData);
      console.log("✅ Login response:", response.data);
      
      if (response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Show success modal
        setShowSuccessModal(true);
        
        // After 2 seconds, redirect to dashboard
        setTimeout(() => {
          setIsAuthenticated(true);
          navigate("/dashboard");
        }, 2000);
      } else {
        setError("Login successful but no token received");
      }
    } catch (err) {
      console.error("❌ Login error details:", err);
      
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error status:", err.response.status);
        setError(err.response.data?.error || err.response.data?.message || "Login failed. Please try again.");
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("Cannot connect to server. Please make sure the backend is running.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setForgotPasswordError("");
    setForgotPasswordMessage("");
    setIsLoading(true);

    // Validate email for step 1
    if (currentStep === 1 && !forgotPasswordData.email) {
      setForgotPasswordError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    try {
      console.log("📧 Sending forgot password request for:", forgotPasswordData.email);
      const response = await API.post("/auth/forgot-password", {
        email: forgotPasswordData.email
      });
      
      console.log("✅ Forgot password response:", response.data);
      
      if (response.data.message) {
        setForgotPasswordMessage("OTP has been sent to your email. Please check your inbox.");
        if (currentStep === 1) {
          setCurrentStep(2); // Move to OTP verification step only if we're on step 1
        }
      } else {
        setForgotPasswordMessage("Password reset instructions sent to your email");
        if (currentStep === 1) {
          setCurrentStep(2);
        }
      }
      
    } catch (err) {
      console.error("❌ Forgot password error:", err);
      // For security, don't reveal if the email exists or not
      setForgotPasswordError("If this email is registered, you will receive OTP shortly");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setForgotPasswordError("");
    setForgotPasswordMessage("");
    setIsLoading(true);

    try {
      console.log("🔍 Verifying OTP for:", forgotPasswordData.email);
      const response = await API.post("/auth/verify-otp", {
        email: forgotPasswordData.email,
        otp: forgotPasswordData.otp
      });
      
      console.log("✅ OTP verification response:", response.data);
      
      setForgotPasswordMessage("OTP verified successfully. Please set your new password.");
      setCurrentStep(3); // Move to password reset step
      
    } catch (err) {
      console.error("❌ OTP verification error:", err);
      setForgotPasswordError(err.response?.data?.error || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordError("");
    setForgotPasswordMessage("");
    
    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setForgotPasswordError("Passwords do not match");
      return;
    }

    if (forgotPasswordData.newPassword.length < 6) {
      setForgotPasswordError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      console.log("🔄 Resetting password for:", forgotPasswordData.email);
      const response = await API.post("/auth/reset-password", {
        email: forgotPasswordData.email,
        otp: forgotPasswordData.otp,
        newPassword: forgotPasswordData.newPassword
      });
      
      console.log("✅ Password reset response:", response.data);
      
      setForgotPasswordMessage("Password reset successfully! You can now login with your new password.");
      
      // Auto-close modal after 3 seconds
      setTimeout(() => {
        setShowForgotPasswordModal(false);
        setCurrentStep(1);
        setForgotPasswordData({
          email: "",
          otp: "",
          newPassword: "",
          confirmPassword: ""
        });
        setForgotPasswordMessage("");
      }, 3000);
      
    } catch (err) {
      console.error("❌ Password reset error:", err);
      setForgotPasswordError(err.response?.data?.error || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForgotPasswordFlow = () => {
    setCurrentStep(1);
    setForgotPasswordData({
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: ""
    });
    setForgotPasswordError("");
    setForgotPasswordMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Login Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Login Successful!</h3>
              <p className="text-gray-600 mb-4">
                Welcome back to CIVIX. Redirecting to dashboard...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {currentStep === 1 && "Reset Password"}
                {currentStep === 2 && "Verify OTP"}
                {currentStep === 3 && "Set New Password"}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {currentStep === 1 && "Enter your email address to receive OTP"}
                {currentStep === 2 && "Enter the OTP sent to your email address"}
                {currentStep === 3 && "Enter your new password"}
              </p>

              {/* Progress Steps */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                    1
                  </div>
                  <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                    2
                  </div>
                  <div className={`w-16 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                    3
                  </div>
                </div>
              </div>

              {forgotPasswordMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                  {forgotPasswordMessage}
                </div>
              )}

              {forgotPasswordError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {forgotPasswordError}
                </div>
              )}

              <form onSubmit={
                currentStep === 1 ? handleSendOtp :
                currentStep === 2 ? handleVerifyOtp :
                handleResetPassword
              }>
                {/* Step 1: Email Input */}
                {currentStep === 1 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={forgotPasswordData.email}
                      onChange={handleForgotPasswordChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                )}

                {/* Step 2: OTP Input */}
                {currentStep === 2 && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        OTP Code
                      </label>
                      <input
                        type="text"
                        name="otp"
                        placeholder="Enter 6-digit OTP"
                        value={forgotPasswordData.otp}
                        onChange={handleForgotPasswordChange}
                        required
                        maxLength="6"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Check your email for the OTP code
                      </p>
                    </div>
                    <div className="text-center mb-4">
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </>
                )}

                {/* Step 3: New Password Input */}
                {currentStep === 3 && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="Enter new password"
                        value={forgotPasswordData.newPassword}
                        onChange={handleForgotPasswordChange}
                        required
                        minLength="6"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={forgotPasswordData.confirmPassword}
                        onChange={handleForgotPasswordChange}
                        required
                        minLength="6"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                  </>
                )}
                
                <div className="flex space-x-3">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                    >
                      Back
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPasswordModal(false);
                        resetForgotPasswordFlow();
                      }}
                      className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {isLoading ? "Processing..." : 
                     currentStep === 1 ? "Send OTP" :
                     currentStep === 2 ? "Verify OTP" :
                     "Reset Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row max-w-4xl w-full overflow-hidden">
        
        {/* Left Section */}
        <div className="md:w-1/2 bg-green-200 p-10 flex flex-col justify-center">
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-2xl">🏛️</span>
            <h1 className="text-2xl font-bold text-gray-700">CIVIX</h1>
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Digital Civic Engagement platform
          </h2>
          <p className="text-gray-600 mb-6">
            Civix enables citizens to engage in local governance through petitions,
            voting and tracking officials responses.
          </p>

          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center space-x-2">
              <span>✏️</span>
              <span>Create and Sign Petitions</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>✔️</span>
              <span>Participate in Public Polls</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>📊</span>
              <span>Track Official Responses</span>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 bg-gray-50 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to Civix
          </h2>
          <p className="text-gray-600 mb-6">
            Join our platform to make your voice heard in local Governance
          </p>

          <div className="flex mb-6 space-x-6">
            <button className="font-semibold text-gray-800 border-b-2 border-green-400">
              Login
            </button>
            <Link 
              to="/signup" 
              className="text-gray-500 hover:text-gray-700"
            >
              Register
            </Link>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-green-400 text-white font-semibold rounded-lg hover:bg-green-500 transition"
            >
              Sign In
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => setShowForgotPasswordModal(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Forgot your password?
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-green-500 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}