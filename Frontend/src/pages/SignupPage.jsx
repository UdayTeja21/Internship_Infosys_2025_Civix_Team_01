// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import API from "../api";

// // Eye icon SVG components for better reusability
// const EyeIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639l4.43-4.44a1.012 1.012 0 011.415 0l3.85 3.85a1.012 1.012 0 010 1.415l-3.85 3.85a1.012 1.012 0 01-1.415 0l-4.43-4.44z" />
//       <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12c0 .621-.504 1.125-1.125 1.125S13.5 12.621 13.5 12s.504-1.125 1.125-1.125S15.75 11.379 15.75 12z" />
//     </svg>
//   );

//   const EyeSlashIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
//     </svg>
//   );

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
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     // Frontend validation
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

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setError("Please enter a valid email address");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Call backend API
//       const response = await API.register({
//         fullName: fullName.trim(),
//         email: email.toLowerCase().trim(),
//         password,
//         role: role.toLowerCase(),
//       });

//       console.log("Registration response:", response.data);

//       // On successful registration, redirect to the login page.
//       if (response.data) {
//         navigate("/login");
//       }
//     } catch (err) {
//       console.error("Registration error:", err);
//       if (err.response?.data?.error) {
//         setError(err.response.data.error);
//       } else if (err.response?.data?.message) {
//         setError(err.response.data.message);
//       } else {
//         setError("Registration failed. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="w-full max-w-5xl bg-white rounded-xl shadow-md flex overflow-hidden">
        
//         {/* Left Section */}
//         <div className="hidden md:flex w-1/2 bg-green-200 p-10 flex-col justify-center">
//           <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800 mb-4">
//             <span className="text-3xl">🏛️</span> CIVIX
//           </h1>
//           <h2 className="text-lg font-semibold text-gray-800 mb-2">
//             Digital Civic Engagement platform
//           </h2>
//           <p className="text-gray-700 mb-6">
//             Civix enables citizens to engage in local governance through
//             petitions, voting and tracking officials responses.
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

//         {/* Right Section */}
//         <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-gray-50">
//           <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome to Civix</h2>
//           <p className="text-gray-600 mb-6">
//             Join our platform to make your voice heard in local Governance
//           </p>

//           {/* Tabs */}
//           <div className="flex gap-6 mb-6 text-gray-600 font-medium">
//             <Link
//               to="/login"
//               className="hover:text-gray-900 transition border-b-2 border-transparent hover:border-gray-900 pb-1"
//             >
//               Login
//             </Link>
//             <span className="text-gray-900 font-semibold border-b-2 border-gray-900 pb-1">
//               Register
//             </span>
//           </div>

//           {/* Error message */}
//           {error && (
//             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
//               {error}
//             </div>
//           )}

//           {/* Signup Form */}
//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <input
//               type="text"
//               placeholder="Full name"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               required
//               className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-green-400 outline-none"
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-green-400 outline-none"
//             />
//             <div className="relative">
//                 <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 minLength={6}
//                 className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-green-400 outline-none"
//                 />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3">
//                     {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
//                 </button>
//             </div>
//             <div className="relative">
//                 <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="Confirm Password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 minLength={6}
//                 className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-green-400 outline-none"
//                 />
//                 <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center px-3">
//                     {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
//                 </button>
//             </div>

//             <div>
//               <p className="text-gray-600 text-sm mb-2">I am registering as:</p>
//               <div className="flex items-center gap-6">
//                 <label className="flex items-center gap-2 text-gray-700">
//                   <input
//                     type="radio"
//                     name="role"
//                     value="citizen"
//                     checked={role === "citizen"}
//                     onChange={() => setRole("citizen")}
//                   />
//                   Citizen
//                 </label>
//                 <label className="flex items-center gap-2 text-gray-700">
//                   <input
//                     type="radio"
//                     name="role"
//                     value="official"
//                     checked={role === "official"}
//                     onChange={() => setRole("official")}
//                   />
//                   Public Official
//                 </label>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? "Creating Account..." : "Create Account"}
//             </button>
//           </form>

//           <p className="text-center text-gray-600 mt-4">
//             Already have an account?{" "}
//             <Link to="/login" className="text-green-600 font-medium">
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;


import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom"; // Mocking for standalone functionality
// import API from "../api"; // Mocking API for standalone functionality

// --- MOCK IMPLEMENTATIONS START ---
// In a real app, you would get these from your routing and API setup.
// We are mocking them here to make the component runnable.
const Link = ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>;
const useNavigate = () => (path) => console.log(`Navigating to ${path}`);

const API = {
  register: async (userData) => {
    console.log("Mock API registration with:", userData);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    if (userData.email === "test@test.com") {
        // Simulate a failure for a specific email
        const error = new Error("User already exists");
        error.response = { data: { error: "An account with this email already exists." } };
        throw error;
    }
    // Simulate a successful registration
    return { data: { message: "Registration successful!" } };
  }
};
// --- MOCK IMPLEMENTATIONS END ---


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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Frontend validation
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      // Call backend API
      const response = await API.register({
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        password,
        role: role.toLowerCase(),
      });

      console.log("Registration response:", response.data);

      // On successful registration, redirect to the login page.
      if (response.data) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-md flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Section */}
        <div className="hidden md:flex w-full md:w-1/2 bg-green-200 p-10 flex-col justify-center">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800 mb-4">
            <span className="text-3xl">🏛️</span> CIVIX
          </h1>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Digital Civic Engagement platform
          </h2>
          <p className="text-gray-700 mb-6">
            Civix enables citizens to engage in local governance through
            petitions, voting and tracking officials responses.
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

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome to Civix</h2>
          <p className="text-gray-600 mb-6">
            Join our platform to make your voice heard in local Governance
          </p>

          {/* Tabs */}
          <div className="flex gap-6 mb-6 text-gray-600 font-medium">
            <Link
              to="/login"
              className="hover:text-gray-900 transition border-b-2 border-transparent hover:border-gray-900 pb-1"
            >
              Login
            </Link>
            <span className="text-gray-900 font-semibold border-b-2 border-gray-900 pb-1">
              Register
            </span>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Signup Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-green-400 outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-green-400 outline-none"
            />
            <div className="relative">
                <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-green-400 outline-none"
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
                minLength={6}
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-green-400 outline-none"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center px-3">
                    {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-2">I am registering as:</p>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="radio"
                    name="role"
                    value="citizen"
                    checked={role === "citizen"}
                    onChange={() => setRole("citizen")}
                  />
                  Citizen
                </label>
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="radio"
                    name="role"
                    value="official"
                    checked={role === "official"}
                    onChange={() => setRole("official")}
                  />
                  Public Official
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

