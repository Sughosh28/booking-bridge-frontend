import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    eventId: '',
    event_name: '',
    totalTickets: 0,
    remainingTickets:0

  });
  const [loading, setLoading] = useState(true);
  const { eventId } = useParams();

  useEffect(() => {
    const fetchTicketsSold = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(
          `http://localhost:8089/api/organizer/${eventId}/totalTickets`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAnalyticsData(response.data);
      } catch (error) {
        console.log('Error fetching ticket data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketsSold();
  }, [eventId]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Event Analytics</h2>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Tickets Sold for <span className='text-blue-600 text-lg font-bold'>{analyticsData.event_name}</span>
          </h3>
          
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-blue-200 rounded w-24"></div>
            </div>
          ) : (
            <div className="text-4xl font-bold text-blue-600">
              {analyticsData.totalTickets}
              <span className="text-lg font-normal text-gray-500 ml-2">tickets</span>
            </div>
          )}
          <h3 className="text-sm font-semibold text-gray-700 mb-2 pt-4">
            Tickets Remaining for <span className='text-blue-600 text-lg font-bold'>{analyticsData.event_name}</span>
             : {analyticsData.remainingTickets}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
