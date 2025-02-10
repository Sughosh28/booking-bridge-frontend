import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UpcomingEvents from "./UpcomingEvents";

const OrganizerDashboard = () => {
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [recentEvents, setRecentEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [eventsCount, setEventsCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleLengthChange = (length) => {
    setEventsCount(length);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch total events
        const totalEventsResponse = await axios.get(
          "http://localhost:8089/api/organizer/totalEvents",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setTotalEvents(totalEventsResponse.data);

        // Fetch total tickets
        const totalTicketsResponse = await axios.get(
          "http://localhost:8089/api/organizer/total-ticket-bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setTotalTickets(totalTicketsResponse.data.totalTickets);

        // Fetch recent events
        const recentEventsResponse = await axios.get(
          "http://localhost:8089/api/organizer/recent-events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setRecentEvents(recentEventsResponse.data);

        const upcoming = recentEventsResponse.data.filter(
          (event) => new Date(event.event_date) > new Date()
        );
        setUpcomingEvents(upcoming);
      } catch (error) {
        console.log("Error:", error);
        if (isMounted) {
          setLoading(false);
        }
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-50 rounded-full">
          <span className="text-3xl">{icon}</span>
        </div>
        <div>
          <h3 className="text-gray-600 font-medium">{title}</h3>
          <p className="text-3xl font-bold mt-1 text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const EventCard = ({ event }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">{event.event_name}</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
          {event.category}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <span className="mr-2">📅</span>
          <span className="text-sm">was on {event.event_date}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="mr-2">📍</span>
          <span className="text-sm"> at {event.event_location}</span>
        </div>

        <div className="mt-4">
          <p className="font-medium text-gray-900 mb-2">Featured Artists:</p>
          <div className="flex flex-wrap gap-2">
            {event.artists.map((artist, index) => (
              <span
                key={index}
                className="bg-gray-100 text-blue-700 px-1 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {artist}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-8">
      <header className="flex justify-between items-center mb-12 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Organizer Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your events and track performance
          </p>
        </div>
       
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Events" value={totalEvents} icon="📅" />
        <StatCard title="Total Tickets Booked" value={totalTickets} icon="🎟️" />
        <StatCard
          title="Upcoming Events"
          value={eventsCount} 
          icon="🗓️"
        />
      </div>
      <section>
        <UpcomingEvents onLengthChange={handleLengthChange} upcomingEvents={upcomingEvents} />
      </section>

      <section className="mb-8">
  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
    <span className="mr-2">🗓️</span>
    Recent Events
  </h2>
  {loading ? (
    <div className="flex items-center justify-center h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  ) : recentEvents.length === 0 ? (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <p className="text-gray-600 text-lg">No recent events found</p>
      <p className="text-gray-500 mt-2">The past events will appear here</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recentEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )}
</section>

    </div>
  );
};

export default OrganizerDashboard;
