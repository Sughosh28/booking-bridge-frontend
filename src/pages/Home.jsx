import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import BookingModal from "./BookingModal";

const Home = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const token = useSelector((state) => state.auth.token);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Events");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);

  const categories = [
    "All Events",
    "Technology",
    "Music",
    "Food & Drinks",
    "Arts",
    "Business",
    "Sports",
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8089/getEvents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.log("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn && token) {
      fetchEvents();
    }
  }, [isLoggedIn, token]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8089/search?keyword=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("Error searching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (category) => {
    setActiveCategory(category);
    setLoading(true);
    try {
      if (category === "All Events") {
        const response = await axios.get("http://localhost:8089/getEvents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(Array.isArray(response.data) ? response.data : []);
      } else {
        const response = await axios.get(
          `http://localhost:8089/getEventsByCategory?category=${category}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvents(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.log("Error fetching category events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (filterType, value) => {
    setLoading(true);
    try {
      let response;
      switch (filterType) {
        case "location":
          response = await axios.get(
            `http://localhost:8089/getEventsByLocation?location=${value}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          break;
        case "date":
          response = await axios.get(
            `http://localhost:8089/getEventsByDate?date=${value}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          break;
        case "time":
          response = await axios.get(
            `http://localhost:8089/getEventsByTime?time=${value}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          break;
        default:
          break;
      }
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("Error filtering events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-8">
              Your Next Great Experience Awaits
            </h1>
            <p className="text-xl text-white mb-12 max-w-2xl mx-auto">
              Join BookingBridge to discover and book amazing events. From tech
              conferences to music festivals, find experiences that match your
              interests.
            </p>
            <div className="space-x-6">
              <Link
                to="/login"
                className="px-8 py-3 bg-white text-teal-600 rounded-lg font-medium hover:bg-gray-100 transition duration-300 shadow-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition duration-300 shadow-lg border border-white/20"
              >
                Sign Up
              </Link>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                <div className="text-4xl mb-4">🎫</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Exclusive Events
                </h3>
                <p className="text-white/80">
                  Access to premium events and experiences
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Easy Booking
                </h3>
                <p className="text-white/80">
                  Simple and secure ticket booking process
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                <div className="text-4xl mb-4">💫</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Verified Organizers
                </h3>
                <p className="text-white/80">
                  All events from trusted organizers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                Discover and Book Amazing Events
              </h1>
              <p className="mt-3 max-w-md mx-auto text-white text-xl sm:text-2xl md:mt-5 md:max-w-3xl">
                Find and book the best events in your city
              </p>
              <div className="mt-8">
                <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-4 flex gap-2">
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <button
                      onClick={handleSearch}
                      className="px-6 py-2 bg-gradient-to-r from-teal-400 to-cyan-400 text-white rounded-lg hover:opacity-90 transition duration-300"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategorySelect(category)}
                className={`px-4 py-2 rounded-full shadow-sm whitespace-nowrap transition duration-300 ${
                  activeCategory === category
                    ? "bg-teal-500 text-white"
                    : "bg-white text-gray-700 hover:bg-teal-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-400 to-cyan-400 text-white rounded-lg hover:shadow-lg hover:opacity-90 transition-all duration-300 font-medium"
          >
            <span>Filters</span>
            <svg
              className="w-5 h-5 transition-transform duration-300 transform"
              style={{
                transform: showFilters ? "rotate(180deg)" : "rotate(0)",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>

          {showFilters && (
            <div className="mt-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Location
                    <span className="text-teal-500 ml-1">📍</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedLocation}
                      onChange={(e) => {
                        setSelectedLocation(e.target.value);
                        handleFilter("location", e.target.value);
                      }}
                      placeholder="Enter location"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 placeholder-gray-400 text-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Date
                    <span className="text-teal-500 ml-1">📅</span>
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      handleFilter("date", e.target.value);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 text-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Time
                    <span className="text-teal-500 ml-1">⏰</span>
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => {
                      setSelectedTime(e.target.value);
                      handleFilter("time", e.target.value);
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300 text-gray-600"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Events</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
                >
                  <img
                    src={`https://source.unsplash.com/random/800x600?${event.category}`}
                    alt={event.event_name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {event.event_name}
                      </h3>
                      <span className="text-teal-600 font-medium">
                        ${event.event_price}
                      </span>
                    </div>
                    <p className="text-sm text-teal-600">
                      By {event.organizer_name}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="mr-2">📅</span> {event.event_date} at{" "}
                        {event.event_time}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="mr-2">📍</span> {event.event_location}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 flex items-center">
                          <span className="mr-2">👥</span> {event.capacity}
                        </p>
                        <p
                          className={`text-sm ${
                            event.age_restrictions >= 18
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {event.age_restrictions >= 18
                            ? "18+"
                            : event.age_restrictions}
                          +
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {event.artists.map((artist, index) => (
                          <span
                            key={index}
                            className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded"
                          >
                            {artist}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsBookingModalOpen(true);
                      }}
                      className="mt-4 w-full py-2 bg-gradient-to-r from-teal-400 to-cyan-400 text-white rounded-lg hover:opacity-90 transition duration-300"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Events Found
              </h3>
              <p className="text-gray-600">
                There are currently no events available in the {activeCategory}{" "}
                category.
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedEvent && (
        <BookingModal
          event={selectedEvent}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedEvent(null);
          }}
          token={token}
        />
      )}
    </>
  );
};

export default Home;
