from flask import Flask
import threading
from rabitmq import consume_messages  # Import the RabbitMQ consumer

app = Flask(__name__)

# Start RabbitMQ consumer in a background thread
threading.Thread(target=consume_messages, daemon=True).start()

if __name__ == "__main__":
    app.run(port=3003)