import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUpPage() {
  const [role, setRole] = useState("Citizen");

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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to Civix
          </h2>
          <p className="text-gray-600 mb-6">
            Join our platform to make your voice heard in local Governance
          </p>

          <div className="flex mb-6 space-x-6">
            <Link 
              to="/login" 
              className="text-gray-500 hover:text-gray-700"
            >
              Login
            </Link>
            <button className="font-semibold text-gray-800 border-b-2 border-green-400">
              Register
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* Radio Buttons for Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am registering as:
              </label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="Citizen"
                    checked={role === "Citizen"}
                    onChange={() => setRole("Citizen")}
                    className="text-green-400 focus:ring-green-300"
                  />
                  <span>Citizen</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="Public Official"
                    checked={role === "Public Official"}
                    onChange={() => setRole("Public Official")}
                    className="text-green-400 focus:ring-green-300"
                  />
                  <span>Public Official</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-green-400 text-white font-semibold rounded-lg hover:bg-green-500 transition"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-green-500 font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}