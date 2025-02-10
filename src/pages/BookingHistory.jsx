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
        const response = await axios.get('http://localhost:8089/api/bookEvents/users/bookings', {
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
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
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
                <p className="font-medium">${booking.totalAmount.toFixed(2)}</p>
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
          <div className="text-center py-8">
            <p className="text-gray-600">No booking history found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
