import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventList from './EventList';
import BookingForm from './BookingForm';

function App() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch events from Event Service
  useEffect(() => {
    axios.get('http://localhost:3001/events')
      .then(res => setEvents(res.data.events))
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  // Register user
  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:3000/register', { 
        email: 'user@example.com', 
        password: 'password12367' 
      });
      alert('User registered successfully!');
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Event Booking Platform</h1>
      <button 
        onClick={handleRegister}
        style={{ marginBottom: '20px', padding: '10px' }}
      >
        Register Test User
      </button>
      
      <h2>Available Events</h2>
      <EventList events={events} />
    </div>
  );
}

export default App;