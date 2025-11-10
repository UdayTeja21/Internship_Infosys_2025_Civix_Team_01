import React from 'react';
import { useLoading } from './LoadingContext';

const Loader = () => {
  const { loadingCount } = useLoading();

  if (!loadingCount || loadingCount <= 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg p-6 flex items-center gap-4 shadow-lg">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
        <div className="font-medium text-gray-700">Loading...</div>
      </div>
      <style>{`
        .loader {
          border-top-color: #16a34a;
          -webkit-animation: spin 1s linear infinite;
          animation: spin 1s linear infinite;
        }
        @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg) } }
        @keyframes spin { 100% { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
};

export default Loader;
