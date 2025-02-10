import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-6 z-50 max-w-sm w-full mx-4 text-center">
        <svg
          className="w-16 h-16 text-green-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Success!</h3>
        <p className="text-gray-600">Booking deleted successfully</p>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isDeleting,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg p-6 z-50 max-w-sm w-full mx-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  const SuccessModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="bg-white rounded-lg p-6 z-50 max-w-sm w-full mx-4 text-center">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Success!</h3>
          <p className="text-gray-600">Booking deleted successfully</p>
          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8089/api/bookEvents/bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [token]);

  const handleDelete = async () => {
    if (!bookingToDelete) return;

    setIsDeleting(true);
    try {
      await axios.delete(
        `http://localhost:8089/api/bookEvents/bookings/${bookingToDelete}/cancel`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookings(
        bookings.filter((booking) => booking.booking_id !== bookingToDelete)
      );
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    } finally {
      setIsDeleting(false);
      setIsConfirmationOpen(false);
      setBookingToDelete(null);
    }
  };

  const initiateDelete = (bookingId) => {
    setBookingToDelete(bookingId);
    setIsConfirmationOpen(true);
    setActiveMenu(null);
  };

  const handleShare = (booking) => {
    const shareText = `Check out this event: ${booking.event.event_name} at ${
      booking.event.event_location
    } on ${new Date(booking.event.event_date).toLocaleDateString()}`;
    if (navigator.share) {
      navigator.share({
        title: booking.event.event_name,
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Booking details copied to clipboard!");
    }
  };

  const handleMenuClick = (e, bookingId) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === bookingId ? null : bookingId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-teal-600 mb-6">My Bookings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.booking_id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
          >
            <div className="bg-teal-500 text-white p-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {booking.event.event_name}
              </h3>
              <div className="relative">
                <button
                  onClick={(e) => handleMenuClick(e, booking.booking_id)}
                  className="p-1 hover:bg-teal-600 rounded-full transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
                {activeMenu === booking.booking_id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1">
                    <button
                      onClick={() => handleShare(booking)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                        Share
                      </span>
                    </button>
                    <button
                      onClick={() => initiateDelete(booking.booking_id)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Booking ID:</span>
                <span>{booking.booking_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Event Date:</span>
                <span>
                  {new Date(booking.event.event_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Event Time:</span>
                <span>{booking.event.event_time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Check-in Time:</span>
                <span>{booking.event.event_checkIn_time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Location:</span>
                <span>{booking.event.event_location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Number of Tickets:</span>
                <span>{booking.no_of_tickets}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span>₹{booking.total_price}</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="font-medium mb-2">Artists:</p>
                <div className="flex flex-wrap gap-2">
                  {booking.event.artists.map((artist, index) => (
                    <span
                      key={index}
                      className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm"
                    >
                      {artist}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Booked on: {booking.booking_date} at {booking.booking_time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">No bookings found</p>
        </div>
      )}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => {
          setIsConfirmationOpen(false);
          setBookingToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Bookings;
