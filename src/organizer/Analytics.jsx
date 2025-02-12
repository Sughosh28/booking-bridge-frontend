import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    eventId: '',
    event_name: '',
    totalTickets: 0,
    remainingTickets: 0
  });
  const [loading, setLoading] = useState(true);
  const { eventId } = useParams();
  const COLORS = ['#2509f4', '#434549'];
  const ticketData = [
    { name: ' Sold', value: analyticsData.totalTickets },
    { name: 'Unsold', value: analyticsData.remainingTickets }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">
            Event Analytics Dashboard
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Event Details
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Event Name</p>
                  <p className="text-xl font-bold text-blue-700 mt-1">{analyticsData.event_name}</p>
                </div>
                
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-blue-200 rounded-lg w-40"></div>
                    <div className="h-10 bg-blue-200 rounded-lg w-32"></div>
                  </div>
                ) : (
                  <>
                    <div className="bg-white/50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Tickets Sold</p>
                      <div className="text-5xl font-bold text-blue-700 mt-2">
                        {analyticsData.totalTickets}
                        <span className="text-lg font-medium text-gray-600 ml-2">tickets</span>
                      </div>
                    </div>
                    <div className="bg-white/50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Tickets Remaining</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{analyticsData.remainingTickets}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
  
            <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Ticket Distribution
              </h3>
              {!loading && (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={ticketData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      innerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {ticketData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Analytics;
