import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LandingPage = () => {
  // HOOK: Get the current URL location
  const location = useLocation();

  // EFFECT: This runs whenever the URL changes
  useEffect(() => {
    // Get the section ID from the path (e.g., '/features' -> 'features')
    const sectionId = location.pathname.substring(1) || 'home';
    const element = document.getElementById(sectionId);

    // Scroll to the element if it exists
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location]); // Dependency array: re-run effect when location changes

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
            
            {/* UPDATED: Using <Link> for client-side routing */}
            <ul className="hidden md:flex gap-8 list-none">
              <li><Link to="/home" className="text-green-800 font-medium hover:text-green-900 transition-colors">Home</Link></li>
              <li><Link to="/features" className="text-green-800 font-medium hover:text-green-900 transition-colors">Features</Link></li>
              <li><Link to="/about" className="text-green-800 font-medium hover:text-green-900 transition-colors">About</Link></li>
            </ul>
            
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
      <main>
        {/* Hero Section */}
        <section className="pt-24 py-16 px-5" id="home">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center min-h-[80vh]">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-green-800 leading-tight">
                  Empower Your Community to Advocate for Change
                </h1>
                <p className="text-xl text-green-700 leading-relaxed">
                  CIVIX enables citizens to engage in local governance through petitions, voting, and tracking officials' responses. Make your voice heard in local government.
                </p>
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
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gray-800 rounded-full"></div>
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
        <section className="pt-24 py-16 px-5" id="features">
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
        
        {/* About Us Section */}
        <section className="pt-24 py-16 px-5" id="about">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-green-800 mb-6">
              About CIVIX
            </h2>
            <p className="text-xl text-green-700 leading-relaxed mb-8">
              CIVIX was born from a simple idea: that every citizen's voice deserves to be heard. In today's fast-paced world, it's easy to feel disconnected from the local decisions that shape our neighborhoods. Our mission is to bridge that gap by providing a modern, accessible, and powerful digital platform for civic engagement.
            </p>
            <p className="text-xl text-green-700 leading-relaxed">
              We believe in the power of community. By enabling users to create petitions, participate in polls, and track the accountability of public officials, we aim to foster a more transparent, responsive, and collaborative relationship between the people and their government. Join us in building a more engaged and empowered community, one voice at a time.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;