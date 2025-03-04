import React, { useState } from 'react';
import axios from 'axios';

const BookingForm = ({ eventId }) => {
  const [tickets, setTickets] = useState(1);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3002/bookings', { 
        user_id: 1, // Hardcoded for demo
        event_id: eventId, 
        tickets: tickets 
      });
      alert('Booking confirmed! Check notifications.');
    } catch (error) {
      alert('Booking failed: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleBooking} style={{ marginTop: '10px' }}>
      <input
        type="number"
        value={tickets}
        onChange={(e) => setTickets(e.target.value)}
        min="1"
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <button 
        type="submit"
        style={{ 
          padding: '5px 15px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '3px'
        }}
      >
        Book Tickets
      </button>
    </form>
  );
};

export default BookingForm;