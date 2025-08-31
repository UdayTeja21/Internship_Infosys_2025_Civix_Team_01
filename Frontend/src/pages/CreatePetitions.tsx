// import { useState } from "react";

// const CreatePetitions = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   const handleSubmit = (e: { preventDefault: () => void; }) => {
//     e.preventDefault();
//     console.log("New Petition:", { title, description });
//     alert("Petition Created!");
//     setTitle("");
//     setDescription("");
//   };

//   return (
//     <div className="flex-1 p-6">
//       <h1 className="text-2xl font-bold text-gray-800 mb-4">Create a Petition</h1>
//       <p className="text-gray-600 mb-6">
//         Start a petition and share your cause with the community.
//       </p>

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-lg shadow-sm border max-w-xl"
//       >
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Petition Title
//           </label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             placeholder="Enter petition title"
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Petition Description
//           </label>
//           <textarea
//             rows={5}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             placeholder="Describe the issue..."
//             required
//           ></textarea>
//         </div>

//         <button
//           type="submit"
//           className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
//         >
//           Create Petition
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreatePetitions;





























































import { Edit } from 'lucide-react';
import React from 'react';

const CreatePetitions: React.FC = () => {
  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Create and Sign Petitions</h1>
        <p className="text-gray-600">Start a petition to make change happen in your community.</p>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-sm border">
        <div className="max-w-2xl mx-auto">
          <Edit className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Create Your Petition</h3>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Petition Title</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter a compelling title for your petition"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                <option>Select a category</option>
                <option>Environment</option>
                <option>Infrastructure</option>
                <option>Education</option>
                <option>Public Safety</option>
                <option>Transportation</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Petition Description</label>
              <textarea 
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Describe the issue and what change you want to see..."
              ></textarea>
            </div>
            
            <div className="flex gap-4">
              <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium">
                Create Petition
              </button>
              <button type="button" className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 font-medium">
                Save Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePetitions;