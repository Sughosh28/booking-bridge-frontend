import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateModal = ({ isOpen, onClose, onConfirm, eventName, event }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onConfirm();
      setIsUpdating(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      setIsUpdating(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-green-500 text-5xl mb-2">✓</div>
            <h3 className="text-lg font-semibold text-gray-900">Successfully Updated!</h3>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Update Event</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to update "{eventName}"?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium inline-flex items-center"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Event'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UpdateModal;
