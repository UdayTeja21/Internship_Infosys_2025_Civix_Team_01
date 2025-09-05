import React, { useEffect, useState } from 'react';

const CivixApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');

  useEffect(() => {
    // Add smooth scrolling for navigation links
    const handleSmoothScroll = (e) => {
      if (e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    // Add click animation to buttons
    const handleButtonClick = (e) => {
      const button = e.currentTarget;
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.className = 'absolute rounded-full bg-white/60 animate-ping pointer-events-none';
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    };

    document.addEventListener('click', handleSmoothScroll);
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', handleButtonClick);
    });

    return () => {
      document.removeEventListener('click', handleSmoothScroll);
      document.querySelectorAll('button').forEach(button => {
        button.removeEventListener('click', handleButtonClick);
      });
    };
  }, []);

  // Landing Page Component (Your original design)
  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-lime-100">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-6xl mx-auto px-5">
          <nav className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2 text-2xl font-bold text-green-800">
              <span className="text-3xl">🏛️</span>
              CIVIX
            </div>
            
            <ul className="hidden md:flex gap-8 list-none">
              <li><a href="#home" className="text-green-800 font-medium hover:text-green-900 transition-colors">Home</a></li>
              <li><a href="#dashboard" className="text-green-800 font-medium hover:text-green-900 transition-colors">Dashboard</a></li>
              <li><a href="#petitions" className="text-green-800 font-medium hover:text-green-900 transition-colors">Petitions</a></li>
              <li><a href="#polls" className="text-green-800 font-medium hover:text-green-900 transition-colors">Polls</a></li>
              <li><a href="#officials" className="text-green-800 font-medium hover:text-green-900 transition-colors">Officials</a></li>
            </ul>
            
            <button 
              onClick={() => setCurrentPage('login')}
              className="bg-green-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-900 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-5">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center min-h-[80vh]">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-green-800 leading-tight">
                  Empower Your Community to Advocate for Change
                </h1>
                <p className="text-xl text-green-700 leading-relaxed">
                  CIVIX enables citizens to engage in local governance through petitions, voting, and tracking officials' responses. Make your voice heard in local government.
                </p>
                <button 
                  onClick={() => setCurrentPage('login')}
                  className="bg-green-800 text-white px-8 py-4 text-lg rounded-xl font-semibold hover:bg-green-900 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
                >
                  Get Started
                </button>
              </div>
              
              <div className="flex justify-center items-center">
                <div className="relative">
                  <div className="w-72 h-80 bg-gradient-to-br from-red-400 to-red-300 rounded-full float-animation relative">
                    {/* Character Head */}
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gray-800 rounded-full"></div>
                    
                    {/* Megaphone */}
                    <div className="absolute -right-5 top-24 w-28 h-20 bg-gradient-to-r from-blue-500 to-blue-400 rounded-l-lg rounded-r-full transform -rotate-12 shadow-lg flex items-center justify-end pr-3">
                      <span className="text-3xl">📢</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-5">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-16">
              <h2 className="text-4xl font-bold text-green-800 text-center mb-12">
                Platform Features
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/90 p-8 rounded-2xl text-center hover:-translate-y-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
                  <div className="text-5xl mb-4">✍️</div>
                  <h3 className="text-2xl font-semibold text-green-800 mb-4">Create and Sign Petitions</h3>
                  <p className="text-green-700 leading-relaxed">
                    Start grassroots movements by creating petitions for issues you care about and gather community support.
                  </p>
                </div>
                
                <div className="bg-white/90 p-8 rounded-2xl text-center hover:-translate-y-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
                  <div className="text-5xl mb-4">🗳️</div>
                  <h3 className="text-2xl font-semibold text-green-800 mb-4">Participate in Public Polls</h3>
                  <p className="text-green-700 leading-relaxed">
                    Voice your opinion on local issues through community polls and see where your neighbors stand.
                  </p>
                </div>
                
                <div className="bg-white/90 p-8 rounded-2xl text-center hover:-translate-y-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
                  <div className="text-5xl mb-4">📊</div>
                  <h3 className="text-2xl font-semibold text-green-800 mb-4">Track Official Responses</h3>
                  <p className="text-green-700 leading-relaxed">
                    Monitor how your elected officials respond to community concerns and hold them accountable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );

  // Your Login Page Component
  const LoginPage = () => {
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
              <button className="font-semibold text-gray-800 border-b-2 border-green-400">
                Login
              </button>
              <button 
                onClick={() => setCurrentPage('signup')}
                className="text-gray-500 hover:text-gray-700"
              >
                Register
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
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
                  placeholder="Enter your password"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-green-400 text-white font-semibold rounded-lg hover:bg-green-500 transition"
              >
                Sign In
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{" "}
              <button 
                onClick={() => setCurrentPage('signup')}
                className="text-green-500 font-medium hover:underline"
              >
                Register
              </button>
            </p>

            <button 
              onClick={() => setCurrentPage('landing')}
              className="mt-4 text-green-700 hover:text-green-800 flex items-center gap-2"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Your Signup Page Component
  const SignupPage = () => {
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
              <button 
                onClick={() => setCurrentPage('login')}
                className="text-gray-500 hover:text-gray-700"
              >
                Login
              </button>
              <button className="font-semibold text-gray-800 border-b-2 border-green-400">
                Register
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
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
            </div>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <button 
                onClick={() => setCurrentPage('login')}
                className="text-green-500 font-medium hover:underline"
              >
                Sign In
              </button>
            </p>

            <button 
              onClick={() => setCurrentPage('landing')}
              className="mt-4 text-green-700 hover:text-green-800 flex items-center gap-2"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render current page
  return (
    <div>
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'signup' && <SignupPage />}
    </div>
  );
};

export default CivixApp;