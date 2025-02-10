import React from 'react';
import {useNavigate} from 'react-router-dom';

const EventCreationSuccess = ({ onClose }) => {
    const navigate = useNavigate();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Event Created Successfully!</h3>
          <p className="mt-2 text-sm text-gray-500">Your event has been created and is now live.</p>
          <button
            onClick={()=>navigate('/dashboard')}
            className="mt-4 w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCreationSuccess;
