import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

const SignupPage = () => {
  const [role, setRole] = useState("citizen");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

    if (response.data && response.data.token) {
      // Store token + user
      API.setAuthToken(response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("userInfo", JSON.stringify({
        name: fullName,
        email: email,
      }));

      // Redirect based on role
      if (role.toLowerCase() === "official") {
        navigate("/official-dashboard");
      } else {
        navigate("/dashboard");
      }
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


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   // Frontend validation
  //   if (!fullName || !email || !password || !confirmPassword) {
  //     setError("All fields are required");
  //     setLoading(false);
  //     return;
  //   }

  //   if (password !== confirmPassword) {
  //     setError("Passwords do not match");
  //     setLoading(false);
  //     return;
  //   }

  //   if (password.length < 6) {
  //     setError("Password must be at least 6 characters");
  //     setLoading(false);
  //     return;
  //   }

  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(email)) {
  //     setError("Please enter a valid email address");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     // Call the backend API with proper data structure
  //     const response = await API.register({
  //       fullName: fullName.trim(),
  //       email: email.toLowerCase().trim(),
  //       password: password,
  //       role: role.toLowerCase()
  //     });

  //     console.log("Registration response:", response.data);

  //     if (response.data && response.data.token) {
  //       // Store token and user data
  //       API.setAuthToken(response.data.token);
  //       localStorage.setItem("user", JSON.stringify(response.data.user));
  //       localStorage.setItem("userInfo", JSON.stringify({
  //         name: fullName,
  //         email: email
  //       }));

  //       // Navigate based on role
  //       if (role.toLowerCase() === "official") {
  //         navigate("/official-dashboard");
  //       } else {
  //         navigate("/dashboard");
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Registration error:", err);
      
  //     // Detailed error handling
  //     if (err.response?.data?.error) {
  //       setError(err.response.data.error);
  //     } else if (err.response?.data?.message) {
  //       setError(err.response.data.message);
  //     } else if (err.response?.data) {
  //       // Handle validation errors from backend
  //       const errors = err.response.data;
  //       if (typeof errors === 'object') {
  //         const errorMessages = Object.values(errors).flat().join(', ');
  //         setError(errorMessages);
  //       } else {
  //         setError("Registration failed: " + JSON.stringify(errors));
  //       }
  //     } else if (err.message) {
  //       setError(err.message);
  //     } else {
  //       setError("Registration failed. Please try again.");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-md flex overflow-hidden">
        
        {/* Left Section */}
        <div className="w-1/2 bg-green-200 p-10 flex flex-col justify-center">
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
        <div className="w-1/2 p-10 flex flex-col justify-center bg-gray-50">
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
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-green-400 outline-none"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-green-400 outline-none"
            />

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