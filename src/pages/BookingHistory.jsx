import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const response = await axios.get('https://api.srss.live/api/bookEvents/users/bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedBookings = [...response.data].sort((a, b) => 
          new Date(b.bookingDate) - new Date(a.bookingDate)
        );
        setBookings(sortedBookings);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking history:', error);
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Booking History</h1>
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {booking.eventName}
                </h2>
                <p className="text-gray-600">
                  Booking ID: {booking.bookingId}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                booking.bookingStatus === 'Booked'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {booking.bookingStatus}
              </span>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Number of Tickets</p>
                <p className="font-medium">{booking.numberOfTickets}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Amount</p>
                <p className="font-medium">{booking.totalAmount.toFixed(2)} INR.</p>
              </div>
              <div>
                <p className="text-gray-600">Booking Date</p>
                <p className="font-medium">
                  {new Date(booking.bookingDate).toLocaleDateString()} {new Date(booking.bookingDate).toLocaleTimeString()}
                </p>
              </div>
              {booking.cancellationDate && (
                <div>
                  <p className="text-gray-600">Cancellation Date</p>
                  <p className="font-medium">
                    {new Date(booking.cancellationDate).toLocaleDateString()} {new Date(booking.cancellationDate).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {bookings.length === 0 && (
  <div className="text-center py-10">
    <div className="flex flex-col items-center justify-center">
      <svg
        className="w-12 h-12 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <p className="text-xl text-gray-600">No booking history!</p>
      <p className="text-gray-500 mt-2">
        Looks like you haven't booked any events yet.
      </p>
      <a
        href="/"
        className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
      >
        Explore Events
      </a>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default BookingHistory;
