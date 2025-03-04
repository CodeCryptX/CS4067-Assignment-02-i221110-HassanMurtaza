import React from 'react';
import BookingForm from './BookingForm';

const EventList = ({ events }) => {
  return (
    <div>
      {events.map(event => (
        <div 
          key={event.id} 
          style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            marginBottom: '10px',
            borderRadius: '5px'
          }}
        >
          <h3>{event.name}</h3>
          <p>Date: {event.date}</p>
          <p>Location: {event.location}</p>
          <p>Available Tickets: {event.capacity - event.booked}</p>
          <BookingForm eventId={event.id} />
        </div>
      ))}
    </div>
  );
};

export default EventList;