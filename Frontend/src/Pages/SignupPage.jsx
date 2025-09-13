import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [role, setRole] = useState("Citizen");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong!");
    }
  };

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
            Civix enables citizens to engage in local governance through petitions,
            voting and tracking officials responses.
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

          {/* Signup Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-green-400 outline-none"
              required
            />

            <div>
              <p className="text-gray-600 text-sm mb-2">I am registering as:</p>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="radio"
                    name="role"
                    value="Citizen"
                    checked={role === "Citizen"}
                    onChange={() => setRole("Citizen")}
                  />
                  Citizen
                </label>
                <label className="flex items-center gap-2 text-gray-700">
                  <input
                    type="radio"
                    name="role"
                    value="Public Official"
                    checked={role === "Public Official"}
                    onChange={() => setRole("Public Official")}
                  />
                  Public Official
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
            >
              Create Account
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
