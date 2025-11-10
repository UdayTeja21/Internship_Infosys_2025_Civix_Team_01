
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
                    icon: <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />,
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    text: 'Responded'
                };
            case 'under-review':
            case 'under-consideration':
                return {
                    icon: <Hourglass className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />,
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-800',
                    text: 'Under Review'
                };
            case 'pending':
            case 'active':
            default:
                return {
                    icon: <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />,
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-800',
                    text: 'Awaiting Response'
                };
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-32 sm:h-40">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gray-900"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center text-red-600 bg-red-100 p-3 sm:p-4 rounded-lg border border-red-200 text-sm sm:text-base">
                    {error}
                </div>
            );
        }

        if (myPetitions.length === 0) {
            return (
                <div className="text-center py-8 sm:py-12 md:py-16 bg-white rounded-lg shadow-sm border">
                    <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">You haven't created any petitions yet.</h3>
                    <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto px-4">
                        When you create a petition, you can track its progress and official responses here.
                    </p>
                </div>
            );
        }

        return (
            <div className="space-y-4 sm:space-y-6">
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
                        <div key={petition._id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border transition-shadow hover:shadow-md">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                                {/* Status Icon */}
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${statusConfig.bgColor} rounded-full flex-shrink-0 flex items-center justify-center self-start`}>
                                    {statusConfig.icon}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3 sm:mb-2">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 break-words">
                                            {petition.title}
                                        </h3>
                                        <span className={`text-xs font-bold ${statusConfig.bgColor} ${statusConfig.textColor} px-2 sm:px-3 py-1 rounded-full self-start sm:self-auto whitespace-nowrap`}>
                                            {statusConfig.text}
                                        </span>
                                    </div>

                                    {/* Progress Stages - Mobile Vertical / Desktop Horizontal */}
                                    <div className="my-3 sm:my-4 border-t border-b border-gray-200 py-3 sm:py-4">
                                        {/* Mobile Vertical Layout */}
                                        <div className="sm:hidden">
                                            <div className="flex flex-col space-y-4">
                                                {stages.map((stage, index) => {
                                                    const isStageReached = index <= currentStageIndex;
                                                    const isCurrentStage = index === currentStageIndex;
                                                    
                                                    return (
                                                        <div key={stage.name} className="flex items-center space-x-3">
                                                            <div
                                                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-500 flex-shrink-0
                                                                    ${isStageReached ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-400'}
                                                                `}
                                                            >
                                                                {React.cloneElement(stage.icon, { className: 'h-4 w-4' })}
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className={`text-sm font-semibold ${isStageReached ? 'text-green-700' : 'text-gray-500'}`}>
                                                                    {stage.name}
                                                                </p>
                                                                {isCurrentStage && (
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        Current stage
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {index < stages.length - 1 && (
                                                                <div className={`w-6 h-0.5 ml-2 transition-colors duration-500 ${isStageReached ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Desktop Horizontal Layout */}
                                        <div className="hidden sm:flex justify-center items-start">
                                            {stages.map((stage, index) => {
                                                const isStageReached = index <= currentStageIndex;
                                                return (
                                                    <React.Fragment key={stage.name}>
                                                        {index > 0 && (
                                                            <div className={`w-16 sm:w-20 lg:w-28 h-1 mt-4 transition-colors duration-500 ${isStageReached ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                                                        )}
                                                        <div className="flex flex-col items-center w-16 sm:w-20 lg:w-24">
                                                            <div
                                                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500
                                                                    ${isStageReached ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-400'}
                                                                `}
                                                            >
                                                                {React.cloneElement(stage.icon, { className: 'h-4 w-4 sm:h-5 sm:w-5' })}
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

                                    {/* Official Response */}
                                    <div className="text-sm bg-gray-50 p-3 rounded-md border border-gray-200 mt-3">
                                        <p className="font-semibold text-gray-600 text-sm">Official Response:</p>
                                        {petition.officialResponse && petition.officialResponse.message ? (
                                            <p className="text-gray-700 mt-1 text-sm leading-relaxed">
                                                {petition.officialResponse.message}
                                            </p>
                                        ) : (
                                            <p className="text-gray-500 mt-1 italic text-sm">
                                                No official response has been recorded yet.
                                            </p>
                                        )}
                                    </div>

                                    {/* Signature Progress */}
                                    <div className="mt-3 sm:mt-4">
                                        <div className="flex justify-between items-center mb-1 text-xs sm:text-sm">
                                            <p className="font-medium text-gray-700">Signature Progress</p>
                                            <p className="font-semibold text-gray-800">
                                                {signatureCount} / {signatureGoal}
                                            </p>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                                            <div
                                                className="bg-green-600 h-2 sm:h-2.5 rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Submission Date */}
                                    <div className="mt-2 text-xs text-gray-400">
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
        <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Track Your Petitions</h1>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Monitor official responses and signature progress for the petitions you've created.
                    </p>
                </div>
                
                {/* Content */}
                {renderContent()}
            </div>

            {/* Mobile Bottom Spacing */}
            <div className="h-4 sm:h-0"></div>
        </div>
    );
};

export default TrackResponses;
