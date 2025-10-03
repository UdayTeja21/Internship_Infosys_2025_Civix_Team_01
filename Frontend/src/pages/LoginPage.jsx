


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../components/AuthContext";

// Consistent Eye Icon SVGs
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


export default function LoginPage() {
  // State for the main login form
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for main password visibility

  // States for your Forgot Password modal
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showNewPassword, setShowNewPassword] = useState(false); // State for new password visibility in modal
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility in modal

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgotPasswordChange = (e) => {
    setForgotPasswordData({ ...forgotPasswordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          if (result.user.role === "official") {
            navigate("/official-dashboard");
          } else {
            navigate("/dashboard");
          }
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Login page error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- FORGOT PASSWORD FUNCTIONS ---
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setForgotPasswordError("");
    setForgotPasswordMessage("");
    setIsLoading(true);
    if (currentStep === 1 && !forgotPasswordData.email) {
      setForgotPasswordError("Please enter your email address");
      setIsLoading(false);
      return;
    }
    try {
      const response = await API.client.post('/auth/forgot-password', { email: forgotPasswordData.email });
      setForgotPasswordMessage(response.data.message || "OTP sent. Please check your inbox.");
      if (currentStep === 1) setCurrentStep(2);
    } catch (err) {
      setForgotPasswordMessage("If this email is registered, you will receive an OTP shortly.");
      if (currentStep === 1) setCurrentStep(2);
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
      const response = await API.client.post('/auth/verify-otp', { email: forgotPasswordData.email, otp: forgotPasswordData.otp });
      setForgotPasswordMessage(response.data.message || "OTP verified successfully. Please set your new password.");
      setCurrentStep(3);
    } catch (err) {
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
      const response = await API.client.post('/auth/reset-password', {
        email: forgotPasswordData.email,
        otp: forgotPasswordData.otp,
        newPassword: forgotPasswordData.newPassword
      });
      setForgotPasswordMessage(response.data.message || "Password reset successfully!");
      setTimeout(() => {
        setShowForgotPasswordModal(false);
        resetForgotPasswordFlow();
      }, 3000);
    } catch (err) {
      setForgotPasswordError(err.response?.data?.error || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForgotPasswordFlow = () => {
    setCurrentStep(1);
    setForgotPasswordData({ email: "", otp: "", newPassword: "", confirmPassword: "" });
    setForgotPasswordError("");
    setForgotPasswordMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Login Successful!</h3>
            <p className="text-gray-600 mb-4">Redirecting to dashboard...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-green-600 h-2.5 rounded-full animate-pulse"></div></div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {currentStep === 1 && "Reset Password"}
                {currentStep === 2 && "Verify OTP"}
                {currentStep === 3 && "Set New Password"}
              </h3>
              
              {forgotPasswordMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">{forgotPasswordMessage}</div>}
              {forgotPasswordError && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{forgotPasswordError}</div>}
              <form onSubmit={currentStep === 1 ? handleSendOtp : currentStep === 2 ? handleVerifyOtp : handleResetPassword}>
                {currentStep === 1 && <input type="email" name="email" placeholder="Enter your email" value={forgotPasswordData.email} onChange={handleForgotPasswordChange} required className="w-full px-4 py-2 border rounded-lg" />}
                {currentStep === 2 && <input type="text" name="otp" placeholder="Enter 6-digit OTP" value={forgotPasswordData.otp} onChange={handleForgotPasswordChange} required maxLength="6" className="w-full px-4 py-2 border rounded-lg" />}
                {currentStep === 3 && (
                  <>
                    <div className="relative w-full mb-4">
                      <input type={showNewPassword ? "text" : "password"} name="newPassword" placeholder="Enter new password" value={forgotPasswordData.newPassword} onChange={handleForgotPasswordChange} required minLength="6" className="w-full px-4 py-2 border rounded-lg" />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 flex items-center px-3">
                        {showNewPassword ? <EyeSlashIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    <div className="relative w-full">
                      <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm new password" value={forgotPasswordData.confirmPassword} onChange={handleForgotPasswordChange} required minLength="6" className="w-full px-4 py-2 border rounded-lg" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center px-3">
                        {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </>
                )}
                <div className="flex space-x-3 mt-4">
                  <button type="button" onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : setShowForgotPasswordModal(false)} className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-md">
                    {currentStep > 1 ? "Back" : "Cancel"}
                  </button>
                  <button type="submit" disabled={isLoading} className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md">{isLoading ? "Processing..." : (currentStep === 1 ? "Send OTP" : (currentStep === 2 ? "Verify OTP" : "Reset Password"))}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row max-w-4xl w-full overflow-hidden">
        <div className="hidden md:flex md:w-1/2 bg-green-200 p-10 flex-col justify-center">
          <div className="flex items-center space-x-2 mb-6"><span className="text-2xl">🏛️</span><h1 className="text-2xl font-bold text-gray-700">CIVIX</h1></div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Digital Civic Engagement platform</h2>
          <p className="text-gray-600 mb-6">Engage in local governance through petitions, voting and tracking officials responses.</p>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center space-x-2"><span>✏️</span><span>Create and Sign Petitions</span></li>
            <li className="flex items-center space-x-2"><span>✔️</span><span>Participate in Public Polls</span></li>
            <li className="flex items-center space-x-2"><span>📊</span><span>Track Official Responses</span></li>
          </ul>
        </div>
        <div className="w-full md:w-1/2 bg-gray-50 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Civix</h2>
          <p className="text-gray-600 mb-6">Join our platform to make your voice heard</p>
          <div className="flex mb-6 space-x-6">
            <button className="font-semibold text-gray-800 border-b-2 border-green-400">Login</button>
            <Link to="/signup" className="text-gray-500 hover:text-gray-700">Register</Link>
          </div>
          {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required className="mt-1 w-full px-4 py-2 border rounded-lg"/>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required className="mt-1 w-full px-4 py-2 border rounded-lg"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 pt-6">
                     {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-2 bg-green-400 text-white font-semibold rounded-lg hover:bg-green-500 transition disabled:opacity-50">{isLoading ? "Signing In..." : "Sign In"}</button>
          </form>
          <div className="text-center mt-4">
            <button onClick={() => setShowForgotPasswordModal(true)} className="text-orange-600 hover:text-blue-800 text-sm font-medium">Forgot your password?</button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account? <Link to="/signup" className="text-green-500 font-medium hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

