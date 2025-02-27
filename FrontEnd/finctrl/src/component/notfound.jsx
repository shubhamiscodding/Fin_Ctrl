import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-9xl font-extrabold text-gray-700">404</h1>
        <div className="absolute rotate-12 transform -translate-y-24 bg-blue-500 text-white px-2 py-1 rounded-md shadow-lg">
          Page Not Found
        </div>
        <p className="text-2xl font-semibold text-gray-600 mt-8">Oops! The page you're looking for doesn't exist.</p>
        <p className="text-gray-500 mt-4">
          The page might have been moved, deleted, or perhaps never existed or will be availble in features.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;