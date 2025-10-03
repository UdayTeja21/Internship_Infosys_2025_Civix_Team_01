import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// SVG icon components for the mobile menu button
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);


const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // EFFECT: This runs when the URL PATHNAME changes
  useEffect(() => {
    // Close mobile menu on navigation
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    
    // Get the section ID from the path (e.g., '/features' -> 'features')
    const sectionId = location.pathname.substring(1) || 'home';
    const element = document.getElementById(sectionId);

    // Scroll to the element if it exists
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.pathname]); // The dependency is on the URL path

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-100 to-lime-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-6xl mx-auto px-5">
          <nav className="flex justify-between items-center py-4">
            <Link to="/home" className="flex items-center gap-2 text-2xl font-bold text-green-800">
              <span className="text-3xl">🏛️</span>
              CIVIX
            </Link>
            
            {/* Desktop Navigation - Uses paths like /features */}
            <ul className="hidden md:flex gap-8 list-none">
              <li><Link to="/home" className="text-green-800 font-medium hover:text-green-900 transition-colors">Home</Link></li>
              <li><Link to="/features" className="text-green-800 font-medium hover:text-green-900 transition-colors">Features</Link></li>
              <li><Link to="/about" className="text-green-800 font-medium hover:text-green-900 transition-colors">About</Link></li>
            </ul>
            
            {/* This link correctly goes to a different route */}
            <Link
              to="/login"
              className="hidden md:block bg-green-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-900 hover:-translate-y-1 transition-all duration-300"
            >
              Get Started
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-green-800 z-50" aria-label="Toggle menu">
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Menu Panel - Uses paths like /features */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-gradient-to-br from-green-200 to-lime-100 flex flex-col items-center justify-center">
            <ul className="flex flex-col gap-8 text-center list-none">
              <li><Link to="/home" className="text-2xl text-green-800 font-medium hover:text-green-900 transition-colors">Home</Link></li>
              <li><Link to="/features" className="text-2xl text-green-800 font-medium hover:text-green-900 transition-colors">Features</Link></li>
              <li><Link to="/about" className="text-2xl text-green-800 font-medium hover:text-green-900 transition-colors">About</Link></li>
              <li>
                <Link
                  to="/login"
                  className="mt-4 inline-block bg-green-800 text-white px-8 py-4 text-lg rounded-xl font-semibold"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* ALL SECTIONS must have an ID and scroll-mt-24 for the offset */}
        <section className="pt-32 pb-16 px-5 scroll-mt-24" id="home">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center min-h-[calc(100vh-8rem)]">
              <div className="space-y-6 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-bold text-green-800 leading-tight">
                  Empower Your Community to Advocate for Change
                </h1>
                <p className="text-lg md:text-xl text-green-700 leading-relaxed">
                  CIVIX enables citizens to engage in local governance through petitions, voting, and tracking officials' responses. Make your voice heard.
                </p>
                <div className="flex gap-4 justify-center md:justify-start">
                  <Link
                    to="/login"
                    className="bg-green-800 text-white px-8 py-4 text-lg rounded-xl font-semibold hover:bg-green-900 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex justify-center items-center">
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

        <section className="pt-24 py-16 px-5 scroll-mt-24" id="features">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-16">
              <h2 className="text-4xl font-bold text-green-800 text-center mb-12">
                Platform Features
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/90 p-8 rounded-2xl text-center hover:-translate-y-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
                  <div className="text-5xl mb-4">✍️</div>
                  <h3 className="text-2xl font-semibold text-green-800 mb-4">Create Petitions</h3>
                  <p className="text-green-700 leading-relaxed">
                    Start grassroots movements by creating petitions for issues you care about.
                  </p>
                </div>
                <div className="bg-white/90 p-8 rounded-2xl text-center hover:-translate-y-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
                  <div className="text-5xl mb-4">🗳️</div>
                  <h3 className="text-2xl font-semibold text-green-800 mb-4">Public Polls</h3>
                  <p className="text-green-700 leading-relaxed">
                    Voice your opinion on local issues through community polls.
                  </p>
                </div>
                <div className="bg-white/90 p-8 rounded-2xl text-center hover:-translate-y-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
                  <div className="text-5xl mb-4">📊</div>
                  <h3 className="text-2xl font-semibold text-green-800 mb-4">Track Responses</h3>
                  <p className="text-green-700 leading-relaxed">
                    Monitor how your elected officials respond and hold them accountable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="pt-24 py-16 px-5 scroll-mt-24" id="about">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-green-800 mb-6">
              About CIVIX
            </h2>
            <p className="text-lg md:text-xl text-green-700 leading-relaxed mb-8">
              CIVIX was born from a simple idea: that every citizen's voice deserves to be heard. Our mission is to bridge the gap between communities and local governance by providing a modern, accessible, and powerful digital platform for civic engagement.
            </p>
            <p className="text-lg md:text-xl text-green-700 leading-relaxed">
              We believe in the power of community. Join us in building a more engaged and empowered society, one voice at a time.
            </p>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-green-900 text-white mt-16">
        <div className="max-w-6xl mx-auto px-5 py-12">
          <div className="grid md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">CIVIX</h3>
              <p className="text-green-300 mt-2">Empowering Communities.</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/home" className="text-green-300 hover:text-white">Home</Link></li>
                <li><Link to="/features" className="text-green-300 hover:text-white">Features</Link></li>
                <li><Link to="/about" className="text-green-300 hover:text-white">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-green-300 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-green-300 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
              <div className="flex justify-center md:justify-start gap-4">
                <a href="#" aria-label="Twitter" className="text-green-300 hover:text-white text-2xl">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </a>
                <a href="#" aria-label="Facebook" className="text-green-300 hover:text-white text-2xl">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z"></path></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-green-800 text-center text-green-300">
            <p>&copy; {new Date().getFullYear()} CIVIX. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;