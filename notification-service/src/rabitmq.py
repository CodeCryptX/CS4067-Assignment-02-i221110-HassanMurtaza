import pika
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Print to check if RABBITMQ_URL is loaded correctly
RABBITMQ_URL = os.getenv("RABBITMQ_URL")
print(f"RABBITMQ_URL: {RABBITMQ_URL}")  # Debugging line

if not RABBITMQ_URL:
    raise ValueError("RABBITMQ_URL is not set. Check your .env file.")

def consume_messages():
    connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
    channel = connection.channel()
    channel.queue_declare(queue='notifications')

    def callback(ch, method, properties, body):
        message = json.loads(body)
        print(f"Sending email to {message['user_email']}: Booking {message['booking_id']} confirmed!")

    channel.basic_consume(queue='notifications', on_message_callback=callback, auto_ack=True)
    channel.start_consuming()
