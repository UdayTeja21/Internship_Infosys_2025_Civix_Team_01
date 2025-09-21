import { AlertCircle, AlertTriangle, Clock, Edit2, FileText, Filter, MapPin, Search, Trash2, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';

// --- Component: Success Popup ---
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
        <p className="text-sm text-gray-600 mb-6">This popup will close automatically.</p>
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

// --- Component: Confirm Delete Popup ---
const ConfirmDeletePopup = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-4">
            <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Are you sure?</h3>
                <p className="text-gray-600 mb-6">This action cannot be undone. All data for this petition will be permanently deleted.</p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-8 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-8 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
);


// --- Component: Petition Form ---
const PetitionForm = ({ isEditing, formData, error, isLoading, titleInputRef, handleInputChange, handleCancel, handleSubmit, handleUpdate, isFormValid, currentView }) => (
    <div className="flex-1 p-6">
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{isEditing ? 'Edit Petition' : 'Create a New Petition'}</h1>
          <p className="text-gray-600">{isEditing ? 'Update the details for your petition.' : 'Complete this form to create a petition in your community.'}</p>
        </div>
        <button
          onClick={handleCancel}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
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
            ref={titleInputRef}
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
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
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Signature Goal
          </label>
          <input
            type="number"
            name="signatureGoal"
            value={formData.signatureGoal}
            onChange={handleInputChange}
            min="10"
            max="10000"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-600 mt-1">
            Number of signatures needed for this petition to be considered successful
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
            onClick={currentView === 'edit' ? handleUpdate : handleSubmit}
            disabled={!isFormValid || isLoading}
            className={`px-6 py-2 rounded-lg transition-colors ${
              isFormValid && !isLoading
                ? 'bg-gray-800 text-white hover:bg-gray-900'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Processing...' : currentView === 'edit' ? 'Update Petition' : 'Create Petition'}
          </button>
        </div>
      </div>
    </div>
  </div>
);


// --- Main Petitions Component ---
const Petitions = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [petitions, setPetitions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingPetition, setEditingPetition] = useState(null);
    const titleInputRef = useRef(null);
    const [formData, setFormData] = useState({
      title: '',
      category: '',
      location: '',
      description: '',
      signatureGoal: 100
    });

    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [petitionToDelete, setPetitionToDelete] = useState(null);

    const currentView = searchParams.get('view');

    // ✅ **THIS IS THE CORRECTED LOGIC**
    // This robust function ensures the user ID is found correctly.
    const getUserId = () => {
        const userString = localStorage.getItem('user');
        if (userString) {
            try {
                const user = JSON.parse(userString);
                return user.id || user._id; // Checks for both 'id' and '_id'
            } catch (e) {
                return null;
            }
        }
        return null;
    };
    
      useEffect(() => {
        if (currentView === 'browse' || !currentView) {
          fetchPetitions();
        }
      }, [currentView]);
    
      useEffect(() => {
        if ((currentView === 'create' || currentView === 'edit') && titleInputRef.current) {
          const timer = setTimeout(() => {
            if (titleInputRef.current) {
              titleInputRef.current.focus();
              titleInputRef.current.select();
            }
          }, 150);
          return () => clearTimeout(timer);
        }
      }, [currentView]);
    
      const fetchPetitions = async () => {
        const userId = getUserId();
        const params = { limit: 1000, userId };
        try {
          setIsLoading(true);
          const response = await API.getPetitions(params);
          const userPetitions = response.data.petitions;
          setPetitions(userPetitions || []);
        } catch (err) {
          console.error('Error fetching petitions:', err);
          setError('Failed to load petitions');
        } finally {
          setIsLoading(false);
        }
      };
    
      const showSuccess = (message) => {
        setSuccessMessage(message);
        setShowSuccessPopup(true);
        const timer = setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);
        return timer;
      };
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      };
    
      const handleSubmit = async () => {
        try {
          setIsLoading(true);
          const response = await API.createPetition(formData);
          if (response.data && response.data.petition) {
            setFormData({ title: '', category: '', location: '', description: '', signatureGoal: 100 });
            setSearchParams({});
            await fetchPetitions();
            showSuccess('Petition created successfully! 🎉');
            setTimeout(() => {
              setSearchParams({ view: 'browse' });
            }, 3000);
          }
        } catch (err) {
          console.error('Error creating petition:', err);
          setError(err.response?.data?.error || 'Failed to create petition');
        } finally {
          setIsLoading(false);
        }
      };
    
      const handleSignPetition = async (petitionId) => {
        try {
          const response = await API.signPetition(petitionId);
          if (response.data && response.data.signatureCount !== undefined) {
            await fetchPetitions();
            showSuccess('Petition signed successfully! 🎉');
          }
        } catch (err) {
          console.error('Error signing petition:', err);
          setError(err.response?.data?.error || 'Failed to sign petition');
          setTimeout(() => setError(''), 3000);
        }
      };
    
      const handleSign = (petitionId) => {
        handleSignPetition(petitionId);
      };
    
      const handleEdit = (petition) => {
        setEditingPetition(petition);
        setFormData({
          title: petition.title,
          category: petition.category,
          location: petition.location,
          description: petition.description,
          signatureGoal: petition.signatureGoal
        });
        setSearchParams({ view: 'edit' });
        setError('');
      };
    
      const handleUpdate = async () => {
        try {
          setIsLoading(true);
          const response = await API.updatePetition(editingPetition._id, formData);
          if (response.data) {
            setEditingPetition(null);
            setFormData({ title: '', category: '', location: '', description: '', signatureGoal: 100 });
            await fetchPetitions();
            showSuccess('Petition updated successfully! ✨');
            setTimeout(() => {
              setSearchParams({ view: 'browse' });
            }, 3000);
          }
        } catch (err) {
          console.error('Error updating petition:', err);
          setError(err.response?.data?.error || 'Failed to update petition');
        } finally {
          setIsLoading(false);
        }
      };
    
      const handleCancel = () => {
        setSearchParams({});
        setEditingPetition(null);
        setFormData({ title: '', category: '', location: '', description: '', signatureGoal: 100 });
        setSearchTerm('');
        setSelectedCategory('all');
        setSelectedLocation('all');
        setError('');
      };

    const handleDeleteRequest = (petitionId) => {
        setPetitionToDelete(petitionId);
        setShowConfirmPopup(true);
    };

    const handleConfirmDelete = async () => {
        if (!petitionToDelete) return;

        try {
            await API.deletePetition(petitionToDelete);
            await fetchPetitions();
            showSuccess('Petition deleted successfully! 🗑️');
        } catch (err) {
            console.error('Error deleting petition:', err);
            setError(err.response?.data?.error || 'Failed to delete petition');
            setTimeout(() => setError(''), 3000);
        } finally {
            setShowConfirmPopup(false);
            setPetitionToDelete(null);
        }
    };
    
    const handleCancelDelete = () => {
        setShowConfirmPopup(false);
        setPetitionToDelete(null);
    };

    const isFormValid = formData.title && formData.category && formData.location && formData.description;
    const activePetitions = petitions.filter(p => p.status === 'active').length;
    const myPetitions = petitions.filter(p => p.isMyPetition).length;
    const signedPetitions = petitions.filter(p => p.hasSigned && !p.isMyPetition).length;
    const uniqueLocations = Array.from(new Set(petitions.map(p => p.location)));
    const filteredPetitions = petitions.filter(petition => {
      const matchesSearch = petition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        petition.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || petition.category === selectedCategory;
      const matchesLocation = selectedLocation === 'all' || petition.location === selectedLocation;
      return matchesSearch && matchesCategory && matchesLocation;
    });

    if (currentView === 'create' || currentView === 'edit') {
        return (
            <>
                {showSuccessPopup && <SuccessPopup message={successMessage} onClose={() => setShowSuccessPopup(false)} />}
                {showConfirmPopup && <ConfirmDeletePopup onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />}
                <PetitionForm
                    isEditing={currentView === 'edit'}
                    formData={formData}
                    error={error}
                    isLoading={isLoading}
                    titleInputRef={titleInputRef}
                    handleInputChange={handleInputChange}
                    handleCancel={handleCancel}
                    handleSubmit={handleSubmit}
                    handleUpdate={handleUpdate}
                    isFormValid={isFormValid}
                    currentView={currentView}
                />
            </>
        );
    }
    
    return (
        <div className="flex-1 p-6">
            {showSuccessPopup && <SuccessPopup message={successMessage} onClose={() => setShowSuccessPopup(false)} />}
            {showConfirmPopup && <ConfirmDeletePopup onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />}
    
            {currentView === 'browse' ? (
                <>
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">Browse All Petitions</h1>
                                <p className="text-gray-600">Discover and support petitions in your community</p>
                            </div>
                            <button onClick={() => setSearchParams({})} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input type="text" placeholder="Search petitions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                                    <option value="all">All Categories</option>
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
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                                    <option value="all">All Locations</option>
                                    {uniqueLocations.map(location => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-gray-600">Showing {filteredPetitions.length} of {petitions.length} petitions</p>
                            <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedLocation('all'); }} className="text-sm text-blue-600 hover:text-blue-800">Clear Filters</button>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredPetitions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPetitions.map((petition) => (
                                <div key={petition._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${petition.category === 'environment' ? 'bg-green-100 text-green-800' : petition.category === 'transportation' ? 'bg-blue-100 text-blue-800' : petition.category === 'education' ? 'bg-purple-100 text-purple-800' : petition.category === 'healthcare' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{petition.category?.charAt(0).toUpperCase() + petition.category?.slice(1)}</span>
                                        {petition.isMyPetition && (<span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">My Petition</span>)}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{petition.title}</h3>
                                    <div className="flex items-center text-sm text-gray-600 mb-3"><MapPin className="h-4 w-4 mr-1" />{petition.location}</div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{petition.description}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                                        <div className="flex items-center"><Users className="h-4 w-4 mr-1" />{petition.signatures?.length || 0} signatures</div>
                                        <div className="flex items-center"><Clock className="h-4 w-4 mr-1" />{new Date(petition.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button onClick={() => handleSign(petition._id)} disabled={petition.isMyPetition || petition.hasSigned} className={`flex-1 sm:flex-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${petition.isMyPetition ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : petition.hasSigned ? 'bg-green-100 text-green-800 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transform hover:scale-[1.02]'}`}>
                                            {petition.isMyPetition ? 'Your Petition' : petition.hasSigned ? 'Already Signed' : 'Sign Petition'}
                                        </button>
                                        {petition.isMyPetition && (
                                            <button onClick={() => handleEdit(petition)} className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900 transition-all duration-200 hover:shadow-sm flex items-center justify-center gap-1.5">
                                                <Edit2 className="h-4 w-4" /><span className="hidden sm:inline">Edit</span>
                                            </button>
                                        )}
                                        {petition.isMyPetition && (
                                            <button onClick={() => handleDeleteRequest(petition._id)} className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900 transition-all duration-200 hover:shadow-sm flex items-center justify-center gap-1.5">
                                                <Trash2 className="h-4 w-4" /><span className="hidden sm:inline">Delete</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
                            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No petitions found</h3>
                            <p className="text-gray-500 mb-4">{searchTerm || selectedCategory !== 'all' || selectedLocation !== 'all' ? 'Try adjusting your search or filter criteria.' : 'Be the first to create a petition in your community!'}</p>
                            <div className="flex justify-center space-x-4">
                                <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedLocation('all'); }} className="px-4 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium">Clear Filters</button>
                                <button onClick={() => setSearchParams({ view: 'create' })} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">Create Petition</button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Petitions</h1>
                        <p className="text-gray-600">Create, sign, and track petitions in your community.</p>
                    </div>
                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"><h3 className="text-lg font-semibold text-gray-700 mb-2">Active Petitions</h3><div className="text-3xl font-bold text-blue-600 mb-1">{activePetitions}</div><div className="text-sm text-gray-500">Currently running</div></div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"><h3 className="text-lg font-semibold text-gray-700 mb-2">My Petitions</h3><div className="text-3xl font-bold text-green-600 mb-1">{myPetitions}</div><div className="text-sm text-gray-500">Created by you</div></div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"><h3 className="text-lg font-semibold text-gray-700 mb-2">Signed Petitions</h3><div className="text-3xl font-bold text-purple-600 mb-1">{signedPetitions}</div><div className="text-sm text-gray-500">Your signatures</div></div>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-center">
                            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Petition Management</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">Create new petitions or manage existing ones to drive change in your community.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button onClick={() => setSearchParams({ view: 'create' })} className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-sm">Create New Petition</button>
                                <button onClick={() => setSearchParams({ view: 'browse' })} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm">Browse All Petitions</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Petitions;