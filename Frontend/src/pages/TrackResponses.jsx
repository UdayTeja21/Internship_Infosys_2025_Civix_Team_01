// import { CheckCircle, FileText, Hourglass } from 'lucide-react';
// import { useEffect, useState } from 'react';

// const TrackResponses = () => {
//   const [myPetitions, setMyPetitions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUserPetitions = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
        
//         // 1. Get the authentication token from local storage
//         const token = localStorage.getItem('token');
//         if (!token) {
//           throw new Error("You must be logged in to view your petitions.");
//         }

//         // 2. Fetch the petitions from your backend API
//         const response = await fetch('http://localhost:5000/api/petitions/user/my-petitions', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         if (!response.ok) {
//           throw new Error(`The server responded with an error: ${response.status}`);
//         }
        
//         const data = await response.json();
//         setMyPetitions(data || []);

//       } catch (err) {
//         console.error("Failed to fetch user's petitions:", err);
//         setError(err.message || 'Could not load your petitions. Please try again later.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUserPetitions();
//   }, []); // The empty array [] ensures this effect runs only once when the component mounts

//   // Helper function to determine the style and icon for each status
//   const getStatusConfig = (status) => {
//     switch (status) {
//       case 'responded':
//       case 'closed':
//       case 'approved':
//         return {
//           icon: <CheckCircle className="h-6 w-6 text-green-600" />,
//           bgColor: 'bg-green-100',
//           textColor: 'text-green-800',
//           text: 'Responded'
//         };
//       case 'under-review':
//         return {
//           icon: <Hourglass className="h-6 w-6 text-blue-600" />,
//           bgColor: 'bg-blue-100',
//           textColor: 'text-blue-800',
//           text: 'Under Review'
//         };
//       case 'pending':
//       case 'active':
//       default:
//         return {
//           icon: <FileText className="h-6 w-6 text-yellow-600" />,
//           bgColor: 'bg-yellow-100',
//           textColor: 'text-yellow-800',
//           text: 'Awaiting Response'
//         };
//     }
//   };
  
//   // This function decides what content to show based on the current state (loading, error, success)
//   const renderContent = () => {
//     if (isLoading) {
//       return (
//         <div className="flex justify-center items-center h-40">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//         </div>
//       );
//     }

//     if (error) {
//       return <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg border border-red-200">{error}</div>;
//     }

//     if (myPetitions.length === 0) {
//       return (
//         <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
//           <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//           <h3 className="text-xl font-semibold text-gray-700">You haven't created any petitions yet.</h3>
//           <p className="text-gray-500 mt-2">When you create a petition, you can track its progress and official responses here.</p>
//         </div>
//       );
//     }

//     return (
//       <div className="space-y-6">
//         {myPetitions.map((petition) => {
//           const statusConfig = getStatusConfig(petition.status);
//           const signatureCount = petition.signatures?.length || 0;
//           const signatureGoal = petition.signatureGoal || 100;
//           const progress = Math.min((signatureCount / signatureGoal) * 100, 100);

//           return (
//             <div key={petition._id} className="bg-white p-6 rounded-lg shadow-sm border transition-shadow hover:shadow-md">
//               <div className="flex items-start space-x-4">
//                 <div className={`w-12 h-12 ${statusConfig.bgColor} rounded-full flex-shrink-0 flex items-center justify-center`}>
//                   {statusConfig.icon}
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
//                     <h3 className="text-lg font-semibold text-gray-800">{petition.title}</h3>
//                     <span className={`text-xs font-bold ${statusConfig.bgColor} ${statusConfig.textColor} px-3 py-1 rounded-full`}>
//                       {statusConfig.text}
//                     </span>
//                   </div>
                  
//                   <div className="text-sm bg-gray-50 p-3 rounded-md border border-gray-200 mt-3">
//                     <p className="font-semibold text-gray-600">Official Response:</p>
//                     {petition.officialResponse ? (
//                       <p className="text-gray-700 mt-1">{petition.officialResponse.message}</p>
//                     ) : (
//                       <p className="text-gray-500 mt-1 italic">No official response has been recorded yet.</p>
//                     )}
//                   </div>
                  
//                   <div className="mt-4">
//                     <div className="flex justify-between items-center mb-1 text-sm">
//                       <p className="font-medium text-gray-700">Signature Progress</p>
//                       <p className="font-semibold text-gray-800">{signatureCount} / {signatureGoal}</p>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                       <div
//                         className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
//                         style={{ width: `${progress}%` }}
//                       ></div>
//                     </div>
//                   </div>
                  
//                   <div className="mt-3 text-xs text-gray-400">
//                     Submitted: {new Date(petition.createdAt).toLocaleDateString()}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   return (
//     <div className="flex-1 p-6 bg-gray-50">
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Track Your Petitions</h1>
//           <p className="text-gray-600">Monitor official responses and signature progress for the petitions you've created.</p>
//         </div>
//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// export default TrackResponses;




import { CheckCircle, FilePlus, FileText, Hourglass } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const TrackResponses = () => {
    const [myPetitions, setMyPetitions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserPetitions = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("You must be logged in to view your petitions.");
                }

                const response = await fetch('http://localhost:5000/api/petitions/user/my-petitions', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error(`The server responded with an error: ${response.status}`);
                }

                const data = await response.json();
                setMyPetitions(data || []);

            } catch (err) {
                console.error("Failed to fetch user's petitions:", err);
                setError(err.message || 'Could not load your petitions. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserPetitions();
    }, []);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'responded':
            case 'closed':
            case 'approved':
            case 'rejected':
                return {
                    icon: <CheckCircle className="h-6 w-6 text-green-600" />,
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    text: 'Responded'
                };
            case 'under-review':
            case 'under-consideration':
                return {
                    icon: <Hourglass className="h-6 w-6 text-blue-600" />,
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800',
                    text: 'Under Review'
                };
            case 'pending':
            case 'active':
            default:
                return {
                    icon: <FileText className="h-6 w-6 text-yellow-600" />,
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-800',
                    text: 'Awaiting Response'
                };
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            );
        }

        if (error) {
            return <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg border border-red-200">{error}</div>;
        }

        if (myPetitions.length === 0) {
            return (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">You haven't created any petitions yet.</h3>
                    <p className="text-gray-500 mt-2">When you create a petition, you can track its progress and official responses here.</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {myPetitions.map((petition) => {
                    const statusConfig = getStatusConfig(petition.status);
                    const signatureCount = petition.signatures?.length || 0;
                    const signatureGoal = petition.signatureGoal || 100;
                    const progress = Math.min((signatureCount / signatureGoal) * 100, 100);

                    const stages = [
                        { name: 'Submitted', icon: <FilePlus />, statuses: ['pending', 'active'] },
                        { name: 'Under Review', icon: <Hourglass />, statuses: ['under-review', 'under-consideration'] },
                        { name: 'Responded', icon: <CheckCircle />, statuses: ['responded', 'approved', 'rejected', 'closed'] }
                    ];

                    let currentStageIndex = 0;
                    stages.forEach((stage, index) => {
                        if (stage.statuses.includes(petition.status)) {
                            currentStageIndex = index;
                        }
                    });

                    return (
                        <div key={petition._id} className="bg-white p-6 rounded-lg shadow-sm border transition-shadow hover:shadow-md">
                            <div className="flex items-start space-x-4">
                                <div className={`w-12 h-12 ${statusConfig.bgColor} rounded-full flex-shrink-0 flex items-center justify-center`}>
                                    {statusConfig.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
                                        <h3 className="text-lg font-semibold text-gray-800">{petition.title}</h3>
                                        <span className={`text-xs font-bold ${statusConfig.bgColor} ${statusConfig.textColor} px-3 py-1 rounded-full`}>
                                            {statusConfig.text}
                                        </span>
                                    </div>

                                    <div className="my-4 border-t border-b border-gray-200 py-2">
                                        <div className="w-full px-2 pt-4">
                                            <div className="flex items-center">
                                                {stages.map((stage, index) => {
                                                    const isStageReached = index <= currentStageIndex;

                                                    return (
                                                        <React.Fragment key={stage.name}>
                                                            {index > 0 && (
                                                                <div className={`flex-1 h-1 transition-colors duration-500 ${isStageReached ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                                                            )}
                                                            <div className="flex flex-col items-center">
                                                                <div
                                                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500
                                                                        ${isStageReached ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-400'}
                                                                    `}
                                                                >
                                                                    {React.cloneElement(stage.icon, { className: 'h-5 w-5' })}
                                                                </div>
                                                                <p className={`mt-2 text-xs font-semibold text-center ${isStageReached ? 'text-green-700' : 'text-gray-500'}`}>
                                                                    {stage.name}
                                                                </p>
                                                            </div>
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-sm bg-gray-50 p-3 rounded-md border border-gray-200 mt-3">
                                        <p className="font-semibold text-gray-600">Official Response:</p>
                                        {petition.officialResponse && petition.officialResponse.message ? (
                                            <p className="text-gray-700 mt-1">{petition.officialResponse.message}</p>
                                        ) : (
                                            <p className="text-gray-500 mt-1 italic">No official response has been recorded yet.</p>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex justify-between items-center mb-1 text-sm">
                                            <p className="font-medium text-gray-700">Signature Progress</p>
                                            <p className="font-semibold text-gray-800">{signatureCount} / {signatureGoal}</p>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="mt-3 text-xs text-gray-400">
                                        Submitted: {new Date(petition.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex-1 p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Track Your Petitions</h1>
                    <p className="text-gray-600">Monitor official responses and signature progress for the petitions you've created.</p>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default TrackResponses;