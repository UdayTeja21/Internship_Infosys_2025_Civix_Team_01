

import { Edit } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

// --- Success Popup Component ---
const SuccessPopup = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all duration-300 scale-100">
      <div className="text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">{message}</h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">You will be redirected shortly.</p>
        <button
          onClick={onClose}
          className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
        >
          Close Now
        </button>
      </div>
    </div>
  </div>
);

const CreatePetitions = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
    signatureGoal: 100,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.location || !formData.description) {
        setError('Please fill out all required fields.');
        return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await API.createPetition(formData);
      if (response.data && response.data.petition) {
        setShowSuccessPopup(true);
        setTimeout(() => {
          navigate('/dashboard/petitions');
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating petition:', err);
      setError(err.response?.data?.error || 'Failed to create petition. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showSuccessPopup && (
        <SuccessPopup
          message="Petition Created Successfully!"
          onClose={() => navigate('/dashboard/petitions')}
        />
      )}

      <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Create a Petition</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Start a petition to make change happen in your community.
          </p>
        </div>
        
        {/* Form Container */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl shadow-sm border">
          <div className="max-w-2xl mx-auto">
            {/* Icon and Title */}
            <div className="text-center mb-4 sm:mb-6">
              <Edit className="h-12 w-12 sm:h-16 sm:w-16 text-green-600 mx-auto mb-2 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Create Your Petition</h3>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center text-sm sm:text-base">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Petition Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Petition Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  placeholder="Enter a compelling title for your petition"
                />
              </div>
              
              {/* Category and Location - Stack on mobile, side by side on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  >
                    <option value="">Select a category</option>
                    <option value="environment">Environment</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="transportation">Transportation</option>
                    <option value="housing">Housing</option>
                    <option value="public-safety">Public Safety</option>
                    <option value="government">Government</option>
                    <option value="community">Community Development</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                    placeholder="e.g., San Diego, CA"
                  />
                </div>
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Petition Description <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base resize-vertical"
                  placeholder="Describe the issue and what change you want to see..."
                ></textarea>
              </div>

              {/* Signature Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Signature Goal
                </label>
                <input 
                  type="number"
                  name="signatureGoal"
                  value={formData.signatureGoal}
                  onChange={handleInputChange}
                  min="10"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 10 signatures required
                </p>
              </div>
              
              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-green-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-green-700 font-medium disabled:bg-green-300 transition-colors duration-200 text-sm sm:text-base flex-1"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : 'Create Petition'}
                </button>
                
                <button 
                  type="button"
                  onClick={() => navigate('/dashboard/petitions')}
                  className="bg-gray-200 text-gray-700 px-6 sm:px-8 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors duration-200 text-sm sm:text-base flex-1"
                >
                  Cancel
                </button>
              </div>

              {/* Required Fields Note */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  <span className="text-red-500">*</span> indicates required fields
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Bottom Spacing */}
        <div className="h-4 sm:h-0"></div>
      </div>
    </>
  );
};

export default CreatePetitions;
