const express = require('express');
const axios = require('axios');
const amqp = require('amqplib');
const pool = require('./database'); // Import MySQL connection
const app = express();
app.use(express.json());

// Book tickets
app.post('/bookings', async (req, res) => {
  try {
    const { user_id, event_id, tickets } = req.body;

    // 1. Check event availability (sync call to Event Service)
    const availability = await axios.get(`http://localhost:3001/events/${event_id}/availability`);
    if (availability.data.available_tickets < tickets) {
      return res.status(400).json({ error: 'Not enough tickets' });
    }

    // 2. Mock payment processing (sync call to Payment Gateway)
    //await axios.post('http://localhost:3002/payments', { user_id, amount: tickets * 100 });

    // 3. Save booking to MySQL
    const [result] = await pool.query(
      'INSERT INTO bookings (user_id, event_id, tickets, status) VALUES (?, ?, ?, ?)',
      [user_id, event_id, tickets, 'CONFIRMED']
    );

    // 4. Publish confirmation to RabbitMQ (async)
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    // Ensure queue properties are consistent
await channel.assertQueue('notifications', { durable: true }); // Ensure this matches your setup

channel.sendToQueue('notifications', Buffer.from(JSON.stringify({
  booking_id: result.insertId,
  user_email: 'user@example.com', // Replace with actual email
  status: 'CONFIRMED'
})));

    res.status(201).json({ 
      booking_id: result.insertId,
      event_id,
      tickets,
      status: 'CONFIRMED'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3002, () => console.log('Booking Service running on port 3002'));