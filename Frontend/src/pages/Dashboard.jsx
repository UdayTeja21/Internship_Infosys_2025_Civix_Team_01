import { useEffect, useState } from 'react';
import API from '../api'; // Make sure this path is correct

const Dashboard = () => {
  const categories = [
    { id: 'all', label: 'All Categories', color: 'gray' },
    { id: 'environment', label: 'Environment', color: 'purple' },
    { id: 'infrastructure', label: 'Infrastructure', color: 'blue' },
    { id: 'education', label: 'Education', color: 'green' },
    { id: 'public-safety', label: 'Public Safety', color: 'red' },
    { id: 'transportation', label: 'Transportation', color: 'yellow' },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stats, setStats] = useState({ myPetitions: 0, successfulPetitions: 0 });
  const [allPetitions, setAllPetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');

  // ADDITION 1: Copied the function to get User ID from your Petitions.jsx
  const getUserIdFromStorage = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        return user.id || user._id;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const userObj = JSON.parse(userData);
        setUsername(userObj.fullName || userObj.username || '');
      } catch {
        setUsername(userData);
      }
    }
  }, []);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      setIsLoading(true);
      try {
        // ADDITION 2: Get the user's ID before making the API call
        const userId = getUserIdFromStorage();

        // ADDITION 3: Send the userId in the API call, just like Petitions.jsx does
        const response = await API.getPetitions({ limit: 1000, userId });
        const fetchedPetitions = response.data.petitions || [];

        // Now this line will work correctly because the server has added the `isMyPetition` flag
        const myPetitionsCount = fetchedPetitions.filter(p => p.isMyPetition).length;

        const successfulPetitionsCount = fetchedPetitions.filter(p =>
          p.isMyPetition && (p.status === 'successful' || p.status === 'under-review')
        ).length;

        setStats({ myPetitions: myPetitionsCount, successfulPetitions: successfulPetitionsCount });
        setAllPetitions(fetchedPetitions);
      } catch (error) {
        console.error('API Error:', error);
        setAllPetitions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndProcessData();
  }, []);

  const getFilteredPetitions = () => {
    if (!allPetitions) return [];
    const filtered = selectedCategory === 'all'
      ? allPetitions
      : allPetitions.filter(p => p.category === selectedCategory);

    return filtered
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
  };
  
  const displayedPetitions = getFilteredPetitions();

  const getButtonClass = (category) => {
    return selectedCategory === category.id
      ? `px-3 py-1 bg-${category.color}-200 text-${category.color}-800 rounded-full text-sm border-2 border-${category.color}-300`
      : `px-3 py-1 bg-${category.color}-100 text-${category.color}-700 rounded-full text-sm hover:bg-${category.color}-200`;
  };

  return (
    <div className="flex-1 p-6">
      {/* Header and Other JSX */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back{username ? `, ${username}` : ''}!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">My Petitions</h3>
          <div className="text-3xl font-bold text-gray-800">{stats.myPetitions}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Successful Petitions</h3>
          <div className="text-3xl font-bold text-gray-800">{stats.successfulPetitions}</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recently Active Petitions</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={getButtonClass(category)}
            >
              {category.label}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : displayedPetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedPetitions.map((petition) => (
              <div key={petition._id} className="border rounded-lg p-4">
                <h4 className="font-semibold">{petition.title}</h4>
                <p className="text-sm text-gray-600">{petition.description.substring(0, 100)}...</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{petition.category}</span>
                  <span className="text-xs text-gray-500">{petition.signatures?.length || 0} signatures</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No petitions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;