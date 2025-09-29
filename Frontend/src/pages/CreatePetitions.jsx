import { Edit } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

// --- Success Popup Component ---
const SuccessPopup = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-4 transform transition-all duration-300 scale-100">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{message}</h3>
        <p className="text-sm text-gray-600 mb-6">You will be redirected shortly.</p>
        <button
          onClick={onClose}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
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

      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create a Petition</h1>
          <p className="text-gray-600">Start a petition to make change happen in your community.</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <div className="max-w-2xl mx-auto">
            <Edit className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Create Your Petition</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Petition Title</label>
                <input 
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter a compelling title for your petition"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., San Diego, CA"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Petition Description</label>
                <textarea 
                  rows={6}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe the issue and what change you want to see..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Signature Goal</label>
                <input 
                  type="number"
                  name="signatureGoal"
                  value={formData.signatureGoal}
                  onChange={handleInputChange}
                  min="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="flex gap-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium disabled:bg-green-300"
                >
                  {isLoading ? 'Creating...' : 'Create Petition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePetitions;

