FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy server app and React build output
COPY server/ ./server/
COPY client/dist/ ./client/dist/

# Set environment variable for Flask (production mode)
ENV FLASK_DEBUG=false
ENV FLASK_ENV=production
ENV FLASK_HOST=0.0.0.0

# Expose port
EXPOSE 80

# Start Flask app
CMD ["python", "server/shubble.py"]
