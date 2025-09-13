import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token + user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userInfo", JSON.stringify(data.user));

        // Navigate by role
        if (data.role === "Public Official") {
          navigate("/official-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600 mb-6">
            Login to continue your civic engagement journey
          </p>

          <div className="flex mb-6 space-x-6">
            <button className="font-semibold text-gray-800 border-b-2 border-green-400">
              Login
            </button>
            <Link to="/signup" className="text-gray-500 hover:text-gray-700">
              Register
            </Link>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-green-400 text-white font-semibold rounded-lg hover:bg-green-500 transition"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-500 font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
