import React from 'react';

const EventCreationError = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Event Creation Failed</h3>
          <p className="mt-2 text-sm text-gray-500">There was an error creating your event. Please try again.</p>
          <button
            onClick={onClose}
            className="mt-4 w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCreationError;
