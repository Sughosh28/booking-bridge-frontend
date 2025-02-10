import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const UpcomingEvents = ({ onLengthChange }) => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    const validateToken = useCallback(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return false;
      }
      return token;
    }, [navigate]);

   
  
    useEffect(() => {
      const fetchData = async () => {
        const token = validateToken();
        if (!token) return;
  
        try {
          const upcomingEventsResponse = await axios.get(
            "http://localhost:8089/api/organizer/upcoming-events",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          setUpcomingEvents(upcomingEventsResponse.data);
          onLengthChange(upcomingEventsResponse.data.length);

          
        } catch (error) {
          console.log("Error:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [validateToken]);

    const UpcomingEventCard = ({ event }) => {
        return (
          <div className="bg-gradient-to-br from-white to-blue-50 p-2.5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 max-h-64">
            <div className="flex justify-between items-start mb-1">
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-800 truncate">
                  {event.event_name}
                </h3>
                <span className="inline-block bg-blue-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {event.category}
                </span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">{event.event_price} INR.</p>
                <p className="text-[10px] text-gray-500">per ticket</p>
              </div>
            </div>
      
            <div className="grid grid-cols-2 gap-1 mt-1.5 text-[11px]">
              <div className="flex items-center text-gray-700">
                <span className="w-3.5">📅</span>
                <span className="ml-0.5">{event.event_date}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="w-3.5">⏰</span>
                <span className="ml-0.5">{event.event_time}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="w-3.5">📍</span>
                <span className="ml-0.5 truncate">{event.event_location}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="w-3.5">👥</span>
                <span className="ml-0.5">{event.capacity} seats</span>
              </div>
            </div>
      
            <div className="mt-1.5">
              <p className="text-[10px] font-semibold text-gray-700 mb-0.5">Featured Artists</p>
              <div className="flex flex-wrap gap-0.5">
                {event.artists.map((artist, index) => (
                  <span key={index} className="px-1.5 py-0.5 bg-white text-blue-600 text-[10px] rounded-full shadow-sm border border-blue-100">
                    {artist}
                  </span>
                ))}
              </div>
            </div>
      
            <div className="mt-1.5 pt-1.5 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-medium text-gray-600"> By : {event.organizer_name}</p>
                  <p className="text-[10px] text-gray-500">Ph. {event.organizer_contact_details}</p>
                </div>
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] rounded-full">
                  {event.age_restrictions}+
                </span>
              </div>
            </div>
          </div>
        );
      };
      
  
      return (
        <div className="max-w-7xl mx-auto p-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              <span className="mr-2">🗓️</span>
              Upcoming Events
            </h2>
            {loading ? (
              <div className="loading-spinner" />
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Upcoming Events</h3>
                <p className="text-gray-600">There are no events scheduled at the moment. Check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <UpcomingEventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </section>
        </div>
      );
      
  };


  export default UpcomingEvents;

  