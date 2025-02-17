import { useState } from 'react';
import axios from 'axios';

const BookingModal = ({ event, isOpen, onClose, token }) => {
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBooking = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        `http://localhost:8089/api/bookEvents/bookTickets/${event.id}`,
        {
          no_of_tickets: ticketCount
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if(response.status === 201) {
        setSuccess('Booking successful! Check your email for confirmation.');
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 3000);
      }
      
    } catch (error) {
      setError(error.response?.data || 'Failed to book tickets');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{event.event_name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{event.event_date}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{event.event_time}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Price per ticket:</span>
              <span className="font-medium">{event.event_price} INR</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Tickets
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-xl font-semibold w-12 text-center">{ticketCount}</span>
              <button
                onClick={() => setTicketCount(Math.min(event.capacity, ticketCount + 1))}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Price:</span>
              <span>{(event.event_price * ticketCount).toFixed(2)} INR</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <button
            onClick={handleBooking}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-teal-400 to-cyan-400 text-white rounded-lg hover:opacity-90 transition duration-300 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Processing...
              </div>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
