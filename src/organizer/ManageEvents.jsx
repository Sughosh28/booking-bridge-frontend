import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteModal from "./DeleteModal";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState({});

  const validateToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return false;
    }
    return token;
  };

  const handleDeleteClick = (eventId) => {
    setSelectedEventId(eventId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    const token = validateToken();
    if (!token) return;

    try {
      const response = await axios.delete(
        `http://localhost:8089/api/organizer/deleteEvent/${selectedEventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setEvents(events.filter((event) => event.id !== selectedEventId));
        setDeleteSuccess(true);
        setTimeout(() => {
          setDeleteSuccess(false);
          setShowModal(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const token = validateToken();
      if (!token) return;

      try {
        const response = await axios.get(
          "http://localhost:8089/api/organizer/get-all-events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [navigate]);

  const handlePushNotification = async (eventId) => {
    const token = validateToken();
    if (!token) return;

    setNotificationStatus((prev) => ({
      ...prev,
      [eventId]: "sending",
    }));

    try {
      const response = await axios.post(
        `http://localhost:8089/api/organizer/push-mail-notification?eventId=${eventId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setNotificationStatus((prev) => ({
          ...prev,
          [eventId]: "sent",
        }));
        setTimeout(() => {
          setNotificationStatus((prev) => ({
            ...prev,
            [eventId]: null,
          }));
        }, 3000);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      setNotificationStatus((prev) => ({
        ...prev,
        [eventId]: "error",
      }));
      setTimeout(() => {
        setNotificationStatus((prev) => ({
          ...prev,
          [eventId]: null,
        }));
      }, 3000);
    }
  };

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {event.event_name}
            </h3>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {event.category}
            </span>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-blue-600">
              {event.event_price} INR.
            </p>
            <p className="text-xs text-gray-500">Capacity: {event.capacity}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-gray-600">
            <span>📅</span>
            <span className="ml-2">{event.event_date}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span>⏰</span>
            <span className="ml-2">{event.event_time}</span>
          </div>
            <span className="ml-2">{event.age_restrictions}+</span>
          <div className="flex items-center text-gray-600">
            <span>📍</span>
            <span className="ml-2">{event.event_location}</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex flex-wrap gap-1">
            {event.artists.map((artist, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {artist}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => handlePushNotification(event.id)}
            disabled={notificationStatus[event.id] === "sending"}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              notificationStatus[event.id] === "sending"
                ? "text-gray-400"
                : notificationStatus[event.id] === "sent"
                ? "text-green-600"
                : notificationStatus[event.id] === "error"
                ? "text-red-600"
                : "text-purple-600 hover:text-purple-800"
            }`}
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/fluency/48/push-notifications.png"
              alt="push-notifications"
              className={`${
                notificationStatus[event.id] === "sending"
                  ? "animate-pulse"
                  : ""
              }`}
            />
            <span>
              {notificationStatus[event.id] === "sending"
                ? "Sending"
                : notificationStatus[event.id] === "sent"
                ? "Sent"
                : notificationStatus[event.id] === "error"
                ? "Failed"
                : "Notify"}
            </span>
          </button>

          <button
            onClick={() => navigate(`/edit-event/${event.id}`)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/windows/50/create-new.png"
              alt="create-new"
            />
          </button>

          <button
            onClick={() => navigate(`/analytics/${event.id}`)}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/windows/50/bar-chart.png"
              alt="bar-chart"
            />
          </button>
          <button
            onClick={() => handleDeleteClick(event.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Cancel Event
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
          <button
            onClick={() => navigate("/create-event")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>+ </span>
            <span>Create New Event</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
      <DeleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        showSuccess={deleteSuccess}
        eventName={
          events.find((event) => event.id === selectedEventId)?.event_name
        }
      />
    </>
  );
};

export default ManageEvents;
