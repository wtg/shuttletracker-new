FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy server app and React build output
COPY server/ ./server/
COPY client/build/ ./server/static/

# Set environment variable for Flask (production mode)
ENV APP_ENV=production

# Expose port
EXPOSE 5000

# Start Flask app
CMD ["python", "server/app.py"]
