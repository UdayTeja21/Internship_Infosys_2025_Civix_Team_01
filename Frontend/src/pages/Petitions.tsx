import { AlertCircle, Clock, FileText, Filter, MapPin, Search, Users, X } from 'lucide-react';
import React, { useState } from 'react';

interface Petition {
  id: number;
  title: string;
  category: string;
  location: string;
  description: string;
  signatures: number;
  dateCreated: string;
  status: 'active' | 'closed';
  isMyPetition: boolean;
}

const Petitions: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBrowseView, setShowBrowseView] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  
  const [petitions, setPetitions] = useState<Petition[]>([
    {
      id: 1,
      title: "Improve Public Transportation in Downtown",
      category: "transportation",
      location: "Portland, OR",
      description: "We need better bus routes and more frequent service in the downtown area.",
      signatures: 245,
      dateCreated: "2025-08-15",
      status: "active",
      isMyPetition: false
    },
    {
      id: 2,
      title: "Install Solar Panels in All Public Schools",
      category: "environment",
      location: "Seattle, WA",
      description: "Reduce carbon footprint and energy costs by installing solar panels.",
      signatures: 189,
      dateCreated: "2025-08-20",
      status: "active",
      isMyPetition: true
    },
    {
      id: 3,
      title: "Create More Bike Lanes",
      category: "transportation",
      location: "San Francisco, CA",
      description: "Make our city more bike-friendly with dedicated bike lanes.",
      signatures: 156,
      dateCreated: "2025-08-25",
      status: "active",
      isMyPetition: true
    }
  ]);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const newPetition: Petition = {
      id: Date.now(),
      title: formData.title,
      category: formData.category,
      location: formData.location,
      description: formData.description,
      signatures: 0,
      dateCreated: new Date().toISOString().split('T')[0],
      status: 'active',
      isMyPetition: true
    };

    setPetitions(prev => [newPetition, ...prev]);
    setShowSuccessPopup(true);
    setFormData({ title: '', category: '', location: '', description: '' });
    setShowCreateForm(false);

    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setShowBrowseView(false);
    setFormData({ title: '', category: '', location: '', description: '' });
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLocation('all');
  };

  const handleSignPetition = (petitionId: number) => {
    setPetitions(prev => prev.map(p => 
      p.id === petitionId ? { ...p, signatures: p.signatures + 1 } : p
    ));
  };

  const isFormValid = formData.title && formData.category && formData.location && formData.description;

  // Calculate statistics
  const activePetitions = petitions.filter(p => p.status === 'active').length;
  const myPetitions = petitions.filter(p => p.isMyPetition).length;
  const signedPetitions = petitions.filter(p => !p.isMyPetition).length;

  // Get unique locations for filter
  const uniqueLocations = Array.from(new Set(petitions.map(p => p.location)));

  // Filter petitions for browse view
  const filteredPetitions = petitions.filter(petition => {
    const matchesSearch = petition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         petition.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || petition.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || petition.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Create Form View
  if (showCreateForm) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Create a New Petition</h1>
              <p className="text-gray-600">Complete this petition to create in your community.</p>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-green-50 p-8 rounded-lg border border-green-200">
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Petition Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Give your petition a clear, specific title"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-600 mt-1">
                Choose a title that clearly states what change you want to see.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  <option value="environment">Environment</option>
                  <option value="education">Education</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="transportation">Transportation</option>
                  <option value="housing">Housing</option>
                  <option value="safety">Public Safety</option>
                  <option value="government">Government</option>
                  <option value="community">Community Development</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Portland, OR"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-600 mt-1">
                  The area this petition concerns (e.g., Portland, OR)
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the issue and the change you'd like to see..."
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
              />
              <p className="text-sm text-gray-600 mt-1">
                Clearly explain the issue, why it matters, and what specific action you're requesting
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mb-6 border border-gray-300">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Important Information</h4>
                  <p className="text-sm text-gray-600">
                    By submitting this petition, you acknowledge that the content is factual to 
                    the best of your knowledge and not misleading. We may remove petitions that 
                    violate our community guidelines.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isFormValid 
                    ? 'bg-gray-800 text-white hover:bg-gray-900' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Create Petition
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Browse View
  if (showBrowseView) {
    return (
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Browse All Petitions</h1>
              <p className="text-gray-600">Discover and support petitions in your community</p>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search petitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Categories</option>
                <option value="environment">Environment</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="transportation">Transportation</option>
                <option value="housing">Housing</option>
                <option value="safety">Public Safety</option>
                <option value="government">Government</option>
                <option value="community">Community Development</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredPetitions.length} of {petitions.length} petitions
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLocation('all');
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Petitions Grid */}
        {filteredPetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPetitions.map((petition) => (
              <div key={petition.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    petition.category === 'environment' ? 'bg-green-100 text-green-800' :
                    petition.category === 'transportation' ? 'bg-blue-100 text-blue-800' :
                    petition.category === 'education' ? 'bg-purple-100 text-purple-800' :
                    petition.category === 'healthcare' ? 'bg-red-100 text-red-800' :
                    petition.category === 'safety' ? 'bg-red-100 text-red-800' :
                    petition.category === 'housing' ? 'bg-orange-100 text-orange-800' :
                    petition.category === 'government' ? 'bg-indigo-100 text-indigo-800' :
                    petition.category === 'community' ? 'bg-pink-100 text-pink-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {petition.category.charAt(0).toUpperCase() + petition.category.slice(1)}
                  </span>
                  {petition.isMyPetition && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                      My Petition
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{petition.title}</h3>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {petition.location}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{petition.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {petition.signatures} signatures
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(petition.dateCreated).toLocaleDateString()}
                  </div>
                </div>

                <button
                  onClick={() => handleSignPetition(petition.id)}
                  disabled={petition.isMyPetition}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    petition.isMyPetition
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {petition.isMyPetition ? 'Your Petition' : 'Sign Petition'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No petitions found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== 'all' || selectedLocation !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Be the first to create a petition in your community!'}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                }}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear Filters
              </button>
              <button
                onClick={() => {
                  setShowBrowseView(false);
                  setShowCreateForm(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                Create Petition
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="flex-1 p-6">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Petition Created Successfully!</h3>
              <p className="text-gray-600 mb-4">Your petition has been created and is now live in the community.</p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Petitions</h1>
        <p className="text-gray-600">Create, sign, and track petitions in your community.</p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Petitions</h3>
          <div className="text-3xl font-bold text-blue-600 mb-1">{activePetitions}</div>
          <div className="text-sm text-gray-500">Currently running</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">My Petitions</h3>
          <div className="text-3xl font-bold text-green-600 mb-1">{myPetitions}</div>
          <div className="text-sm text-gray-500">Created by you</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Signed Petitions</h3>
          <div className="text-3xl font-bold text-purple-600 mb-1">{signedPetitions}</div>
          <div className="text-sm text-gray-500">Your signatures</div>
        </div>
      </div>

      {/* Petitions List */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Petitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {petitions.slice(0, 4).map((petition) => (
            <div key={petition.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  petition.category === 'environment' ? 'bg-green-100 text-green-800' :
                  petition.category === 'transportation' ? 'bg-blue-100 text-blue-800' :
                  petition.category === 'education' ? 'bg-purple-100 text-purple-800' :
                  petition.category === 'healthcare' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {petition.category.charAt(0).toUpperCase() + petition.category.slice(1)}
                </span>
                {petition.isMyPetition && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    My Petition
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{petition.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{petition.location}</p>
              <p className="text-gray-600 mb-4 line-clamp-2">{petition.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {petition.signatures} signatures
                </div>
                <div className="text-xs text-gray-400">
                  Created {new Date(petition.dateCreated).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Action Card */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Petition Management</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">Create new petitions or manage existing ones to drive change in your community.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-sm"
            >
              Create New Petition
            </button>
            <button 
              onClick={() => setShowBrowseView(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm"
            >
              Browse All Petitions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Petitions;