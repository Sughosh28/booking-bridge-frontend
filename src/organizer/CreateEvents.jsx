import  { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import EventCreationSuccess from './EventCreationSuccess';
import EventCreationError from './EventCreationError';

const CreateEvents = () => {
  const { token } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);


  const [eventData, setEventData] = useState({
    event_name: '',
    event_description: '',
    event_location: '',
    event_price: '',
    category: '',
    capacity: '',
    event_date: '',
    event_time: '',
    artists: '',
    age_restrictions: '',
    organizer_name: '',
    organizer_contact_details: '',
    language: ''
  });

const handleChange = (e) => {
  const { name, value } = e.target;
  setEventData(prevState => ({
      ...prevState,
      [name]: name === 'artists' ? value.split(',').map(item => item.trim()) : value
  }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8089/api/organizer/createEvent',
        eventData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.status === 201) {
        setShowSuccess(true);
        setEventData({
          event_name: '',
          event_description: '',
          event_location: '',
          event_price: '',
          category: '',
          capacity: '',
          event_date: '',
          event_time: '',
          artists: '',
          age_restrictions: '',
          organizer_name: '',
          organizer_contact_details: '',
          language: ''
        });
      }
    } catch (error) {
      setShowError(true);
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <>
    {showError && <EventCreationError onClose={() => setShowError(false)} />}
    {showSuccess && <EventCreationSuccess onClose={() => setShowSuccess(false)} />}

    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Create New Event</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Event Name</label>
            <input
              type="text"
              name="event_name"
              value={eventData.event_name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="event_location"
              value={eventData.event_location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
  
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
            <input
              type="number"
              name="event_price"
              value={eventData.event_price}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
  
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={eventData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white"
              required
            >
              <option value="">Select Category</option>
              <option value="Music">Music</option>
              <option value="Technology">Technology</option>
              <option value="Sports">Sports</option>
              <option value="Arts">Arts & Theatre</option>
              <option value="Food">Food & Drinks</option>
              <option value="Business">Business</option>
              <option value="Education">Education</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>
  
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={eventData.capacity}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
  
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="event_date"
              value={eventData.event_date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
  
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
            <input
              type="time"
              name="event_time"
              value={eventData.event_time}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
  
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Artists</label>
            <input
              type="text"
              name="artists"
              value={eventData.artists}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Separate artists with commas"
              required
            />
          </div>
  
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Age Restrictions</label>
            <input
              type="text"
              name="age_restrictions"
              value={eventData.age_restrictions}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
  
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Organizer Name</label>
            <input
              type="text"
              name="organizer_name"
              value={eventData.organizer_name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
  
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Details</label>
            <input
              type="text"
              name="organizer_contact_details"
              value={eventData.organizer_contact_details}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
  
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
            <input
              type="text"
              name="language"
              value={eventData.language}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
        </div>
  
        <div className="form-group mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Event Description</label>
          <textarea
            name="event_description"
            value={eventData.event_description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 h-32"
            required
          />
        </div>
  
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold mt-6 shadow-lg hover:shadow-xl"
        >
          {isLoading ? 'Creating...' : 'Create Event'}
          </button>
      </form>
    </div>
    </>
  );
  
};

export default CreateEvents;
