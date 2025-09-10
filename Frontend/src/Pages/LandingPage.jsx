import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-lime-100">
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
              <li><a href="#features" className="text-green-800 font-medium hover:text-green-900 transition-colors">Features</a></li>
              <li><a href="#about" className="text-green-800 font-medium hover:text-green-900 transition-colors">About</a></li>
            </ul>
            
            {/* Get Started button goes to login */}
            <Link 
              to="/login"
              className="bg-green-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-900 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-5" id="home">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center min-h-[80vh]">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-green-800 leading-tight">
                  Empower Your Community to Advocate for Change
                </h1>
                <p className="text-xl text-green-700 leading-relaxed">
                  CIVIX enables citizens to engage in local governance through petitions, voting, and tracking officials' responses. Make your voice heard in local government.
                </p>
                
                {/* Navigation button */}
                <div className="flex gap-4">
                  <Link 
                    to="/login"
                    className="bg-green-800 text-white px-8 py-4 text-lg rounded-xl font-semibold hover:bg-green-900 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
                  >
                    Get Started
                  </Link>
                </div>
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
        <section className="py-16 px-5" id="features">
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
};

export default LandingPage;