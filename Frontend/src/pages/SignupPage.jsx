// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import API from "../api";

// // 👁️ Icons
// const EyeIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
//     <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );

// const EyeSlashIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
//     <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
//   </svg>
// );

// const SignupPage = () => {
//   const [role, setRole] = useState("citizen");
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // OTP states
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [otpError, setOtpError] = useState("");
//   const [otpLoading, setOtpLoading] = useState(false);

//   const navigate = useNavigate();

//   // CSS to hide browser-native password reveal icons so only our custom icons show
//   const hideNativePasswordToggleStyles = `
//     /* Remove native reveal/clear icons in Edge/IE */
//     input[type=\"password\"]::-ms-reveal,
//     input[type=\"password\"]::-ms-clear {
//       display: none;
//     }

//     /* Remove native reveal icon in WebKit-based browsers (Chrome, Safari) */
//     input[type=\"password\"]::-webkit-textfield-decoration-button,
//     input[type=\"password\"]::-webkit-credentials-auto-fill-button {
//       display: none !important;
//       visibility: hidden;
//       pointer-events: none;
//     }

//     /* Remove default appearance which can show built-in decorations */
//     input[type=\"password\"] {
//       -webkit-appearance: none;
//       appearance: none;
//     }
//   `;

//   // Step 1 → Request OTP (register)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     if (!fullName || !email || !password || !confirmPassword) {
//       setError("All fields are required");
//       setLoading(false);
//       return;
//     }
//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       setLoading(false);
//       return;
//     }
//     if (password.length < 6) {
//       setError("Password must be at least 6 characters");
//       setLoading(false);
//       return;
//     }

//     try {
//   console.log("📝 Starting registration for:", email);
//   console.log("🔎 Selected role:", role);
//       // Send registration details so server can create user and generate/send OTP
//       const response = await API.register({
//         fullName: fullName.trim(),
//         email: email.toLowerCase().trim(),
//         password,
//         role: role.toLowerCase(),
//       });

//       console.log("📧 Registration response:", response.data);

//       if (response.data.message === "OTP sent to email") {
//         setShowOtpModal(true);
//         setError("");
//       } else {
//         setError("Unexpected response from server");
//       }
//     } catch (err) {
//       console.error("❌ Registration error:", err);
//       setError(err.response?.data?.error || "Failed to send OTP. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Step 2 → Verify OTP & complete signup
//   const handleOtpVerify = async () => {
//     setOtpError("");
//     setOtpLoading(true);
    
//     if (!otp || otp.length !== 6) {
//       setOtpError("Please enter a valid 6-digit OTP");
//       setOtpLoading(false);
//       return;
//     }

//     try {
//       console.log("🔍 Verifying OTP for:", email);
//       const response = await API.verifyOtp({
//         email: email.toLowerCase().trim(),
//         otp,
//         action: "signup",
//       });

//       console.log("✅ OTP verification response:", response.data);

//       if (response.data?.message === "Account verified successfully") {
//         // Store token and user data
//         if (response.data.token) {
//           localStorage.setItem("token", response.data.token);
//           localStorage.setItem("user", JSON.stringify(response.data.user));
//           localStorage.setItem("userId", response.data.user.id);
//         }
        
//         alert("✅ Account verified! You are now logged in.");
//         setShowOtpModal(false);
//         const userRole = response.data.user?.role || "citizen";
//         if (userRole === "official") {
//           navigate("/official-dashboard");
//         } else {
//           navigate("/dashboard");
//         }
//       } else {
//         setOtpError(response.data?.error || "Verification failed");
//       }
//     } catch (err) {
//       console.error("❌ OTP verification error:", err);
//       setOtpError(err.response?.data?.error || "Invalid OTP. Please try again.");
//     } finally {
//       setOtpLoading(false);
//     }
//   };

//   const resendOtp = async () => {
//     setOtpError("");
//     try {
//       // Re-use the register function to resend OTP
//       const response = await API.register({
//         fullName: fullName.trim(),
//         email: email.toLowerCase().trim(),
//         password,
//         role: role.toLowerCase()
//       });
      
//       if (response.data.message === "OTP sent to email") {
//         setOtpError("OTP resent successfully!");
//         setTimeout(() => setOtpError(""), 3000);
//       }
//     } catch (err) {
//       setOtpError("Failed to resend OTP. Please try again.");
//     }
//   };

//   return (
//     <>
//       <style>{hideNativePasswordToggleStyles}</style>
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       {/* OTP Modal */}
//       {showOtpModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full text-center shadow-xl">
//             <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
//             <p className="text-gray-600 mb-3">
//               An OTP has been sent to <b>{email}</b>. Please enter it below:
//             </p>
//             <input
//               type="text"
//               placeholder="Enter 6-digit OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
//               className="w-full px-4 py-2 border rounded-lg mb-3 text-center text-lg font-mono"
//               maxLength={6}
//             />
//             {otpError && (
//               <p className={`mb-2 ${otpError.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
//                 {otpError}
//               </p>
//             )}
//             <button
//               onClick={handleOtpVerify}
//               disabled={otpLoading || otp.length !== 6}
//               className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed mb-2"
//             >
//               {otpLoading ? "Verifying..." : "Verify OTP"}
//             </button>
//             <button
//               onClick={resendOtp}
//               className="text-blue-500 hover:text-blue-700 text-sm"
//             >
//               Resend OTP
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Signup form */}
//       <div className="w-full max-w-5xl bg-white rounded-xl shadow-md flex flex-col md:flex-row overflow-hidden">
//         {/* Left Section */}
//         <div className="hidden md:flex w-full md:w-1/2 bg-green-200 p-10 flex-col justify-center">
//           <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800 mb-4">
//             <span className="text-3xl">🏛️</span> CIVIX
//           </h1>
//           <h2 className="text-lg font-semibold text-gray-800 mb-2">Digital Civic Engagement platform</h2>
//           <p className="text-gray-700 mb-6">
//             Civix enables citizens to engage in local governance through petitions, voting and tracking officials responses.
//           </p>
//           <ul className="space-y-4 text-gray-800">
//             <li className="flex items-center gap-2">
//               <span className="text-orange-500 text-lg">✏️</span> Create and Sign Petitions
//             </li>
//             <li className="flex items-center gap-2">
//               <span className="text-green-600 text-lg">✔</span> Participate in Public Polls
//             </li>
//             <li className="flex items-center gap-2">
//               <span className="text-blue-600 text-lg">📊</span> Track Official Responses
//             </li>
//           </ul>
//         </div>

//         {/* Right Section (form) */}
//         <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-gray-50">
//           <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome to Civix</h2>
//           <p className="text-gray-600 mb-6">Join our platform to make your voice heard in local Governance</p>

//           <div className="flex gap-6 mb-6 text-gray-600 font-medium">
//             <Link to="/login" className="hover:text-gray-900 transition border-b-2 border-transparent hover:border-gray-900 pb-1">Login</Link>
//             <span className="text-gray-900 font-semibold border-b-2 border-gray-900 pb-1">Register</span>
//           </div>

//           {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <input 
//               type="text" 
//               placeholder="Full name" 
//               value={fullName} 
//               onChange={(e) => setFullName(e.target.value)} 
//               required 
//               className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700" 
//             />
//             <input 
//               type="email" 
//               placeholder="Email" 
//               value={email} 
//               onChange={(e) => setEmail(e.target.value)} 
//               required 
//               className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700" 
//             />
            
//             <div className="relative">
//               <input 
//                 type={showPassword ? "text" : "password"} 
//                 placeholder="Password" 
//                 value={password} 
//                 onChange={(e) => setPassword(e.target.value)} 
//                 required 
//                 className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700" 
//               />
//               <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3">
//                 {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
//               </button>
//             </div>

//             <div className="relative">
//               <input 
//                 type={showConfirmPassword ? "text" : "password"} 
//                 placeholder="Confirm Password" 
//                 value={confirmPassword} 
//                 onChange={(e) => setConfirmPassword(e.target.value)} 
//                 required 
//                 className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700" 
//               />
//               <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center px-3">
//                 {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
//               </button>
//             </div>

//             <div>
//               <p className="text-gray-600 text-sm mb-2">I am registering as:</p>
//               <div className="flex items-center gap-6">
//                 <label className="flex items-center gap-2 text-gray-700">
//                   <input type="radio" name="role" value="citizen" checked={role === "citizen"} onChange={(e) => setRole(e.target.value)} /> Citizen
//                 </label>
//                 <label className="flex items-center gap-2 text-gray-700">
//                   <input type="radio" name="role" value="official" checked={role === "official"} onChange={(e) => setRole(e.target.value)} /> Public Official
//                 </label>
//               </div>
//             </div>

//             <button type="submit" disabled={loading} className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
//               {loading ? "Processing..." : "Create Account"}
//             </button>
//           </form>

//           <p className="text-center text-gray-600 mt-4">
//             Already have an account?{" "}
//             <Link to="/login" className="text-green-600 font-medium">Sign In</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// };

// export default SignupPage;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

// 👁️ Icons
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

const SignupPage = () => {
  const [role, setRole] = useState("citizen");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  // NEW: Success popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const navigate = useNavigate();

  // CSS to hide browser-native password reveal icons so only our custom icons show
  const hideNativePasswordToggleStyles = `
    /* Remove native reveal/clear icons in Edge/IE */
    input[type=\"password\"]::-ms-reveal,
    input[type=\"password\"]::-ms-clear {
      display: none;
    }

    /* Remove native reveal icon in WebKit-based browsers (Chrome, Safari) */
    input[type=\"password\"]::-webkit-textfield-decoration-button,
    input[type=\"password\"]::-webkit-credentials-auto-fill-button {
      display: none !important;
      visibility: hidden;
      pointer-events: none;
    }

    /* Remove default appearance which can show built-in decorations */
    input[type=\"password\"] {
      -webkit-appearance: none;
      appearance: none;
    }

    /* NEW: Success popup animation */
    @keyframes scale-in {
      0% {
        opacity: 0;
        transform: scale(0.9);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    .animate-scale-in {
      animation: scale-in 0.3s ease-out forwards;
    }
  `;

  // Step 1 → Request OTP (register)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!fullName || !email || !password || !confirmPassword) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      console.log("📝 Starting registration for:", email);
      console.log("🔎 Selected role:", role);
      // Send registration details so server can create user and generate/send OTP
      const response = await API.register({
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        password,
        role: role.toLowerCase(),
      });

      console.log("📧 Registration response:", response.data);

      if (response.data.message === "OTP sent to email") {
        setShowOtpModal(true);
        setError("");
      } else {
        setError("Unexpected response from server");
      }
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError(err.response?.data?.error || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 → Verify OTP & complete signup (UPDATED)
  const handleOtpVerify = async () => {
    setOtpError("");
    setOtpLoading(true);
    
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      setOtpLoading(false);
      return;
    }

    try {
      console.log("🔍 Verifying OTP for:", email);
      const response = await API.verifyOtp({
        email: email.toLowerCase().trim(),
        otp,
        action: "signup",
      });

      console.log("✅ OTP verification response:", response.data);

      if (response.data?.message === "Account verified successfully") {
        // Store token and user data
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("userId", response.data.user.id);
        }
        
        // UPDATED: Close OTP modal first, then show success popup
        setShowOtpModal(false);
        setShowSuccessPopup(true);
        
        // Redirect after 2 seconds
        const userRole = response.data.user?.role || "citizen";
        setTimeout(() => {
          if (userRole === "official") {
            navigate("/official-dashboard");
          } else {
            navigate("/dashboard");
          }
        }, 5000);
      } else {
        setOtpError(response.data?.error || "Verification failed");
      }
    } catch (err) {
      console.error("❌ OTP verification error:", err);
      setOtpError(err.response?.data?.error || "Invalid OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const resendOtp = async () => {
    setOtpError("");
    try {
      // Re-use the register function to resend OTP
      const response = await API.register({
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        password,
        role: role.toLowerCase()
      });
      
      if (response.data.message === "OTP sent to email") {
        setOtpError("OTP resent successfully!");
        setTimeout(() => setOtpError(""), 3000);
      }
    } catch (err) {
      setOtpError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <>
      <style>{hideNativePasswordToggleStyles}</style>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      
      {/* NEW: Success Popup - Shows after OTP verification */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-scale-in">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              {/* Success Message */}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Account Created Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Welcome to CIVIX! Redirecting you to your dashboard...
              </p>

              {/* Loading Spinner */}
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center shadow-xl">
            <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
            <p className="text-gray-600 mb-3">
              An OTP has been sent to <b>{email}</b>. Please enter it below:
            </p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-2 border rounded-lg mb-3 text-center text-lg font-mono"
              maxLength={6}
            />
            {otpError && (
              <p className={`mb-2 ${otpError.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
                {otpError}
              </p>
            )}
            <button
              onClick={handleOtpVerify}
              disabled={otpLoading || otp.length !== 6}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed mb-2"
            >
              {otpLoading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              onClick={resendOtp}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Resend OTP
            </button>
          </div>
        </div>
      )}

      {/* Signup form */}
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-md flex flex-col md:flex-row overflow-hidden">
        {/* Left Section */}
        <div className="hidden md:flex w-full md:w-1/2 bg-green-200 p-10 flex-col justify-center">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800 mb-4">
            <span className="text-3xl">🏛️</span> CIVIX
          </h1>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Digital Civic Engagement platform</h2>
          <p className="text-gray-700 mb-6">
            Civix enables citizens to engage in local governance through petitions, voting and tracking officials responses.
          </p>
          <ul className="space-y-4 text-gray-800">
            <li className="flex items-center gap-2">
              <span className="text-orange-500 text-lg">✏️</span> Create and Sign Petitions
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 text-lg">✔</span> Participate in Public Polls
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600 text-lg">📊</span> Track Official Responses
            </li>
          </ul>
        </div>

        {/* Right Section (form) */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome to Civix</h2>
          <p className="text-gray-600 mb-6">Join our platform to make your voice heard in local Governance</p>

          <div className="flex gap-6 mb-6 text-gray-600 font-medium">
            <Link to="/login" className="hover:text-gray-900 transition border-b-2 border-transparent hover:border-gray-900 pb-1">Login</Link>
            <span className="text-gray-900 font-semibold border-b-2 border-gray-900 pb-1">Register</span>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Full name" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700" 
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700" 
            />
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3">
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700" 
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center px-3">
                {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-2">I am registering as:</p>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-gray-700">
                  <input type="radio" name="role" value="citizen" checked={role === "citizen"} onChange={(e) => setRole(e.target.value)} /> Citizen
                </label>
                <label className="flex items-center gap-2 text-gray-700">
                  <input type="radio" name="role" value="official" checked={role === "official"} onChange={(e) => setRole(e.target.value)} /> Public Official
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Processing..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default SignupPage;