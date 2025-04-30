from flask import Flask, request, send_from_directory
from pathlib import Path
import os
import logging

flask_debug = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
production = os.environ.get('FLASK_ENV', 'development').lower() == 'production'
port = int(os.environ.get('PORT', 3000))
host = os.environ.get('FLASK_HOST', '0.0.0.0')

app = Flask(
    __name__,
    static_folder='../client/dist/',
    static_url_path='/'
)

vehicles = []
latest_locations = []

@app.route('/')
@app.route('/schedule')
def serve_react():
    root_dir = Path(app.static_folder)
    return send_from_directory(root_dir, 'index.html')

@app.route('/api/locations', methods=['GET'])
def get_locations():
    global latest_locations
    return {'locations': latest_locations}

@app.route('/api/webhook', methods=['POST'])
def webhook():
    global latest_locations
    data = request.json
    if not data:
        return {'status': 'error', 'message': 'Invalid JSON'}, 400
    try:
        # extract the data
        if flask_debug:
            app.logger.debug(f'Received data: {data}')
        event_data = data.get('data', None)
        if not event_data:
            app.logger.error('Invalid data')
            return {'status': 'error', 'message': 'Invalid data'}, 400
        event_vehicle = event_data.get('vehicle', None)
        if not event_vehicle:
            app.logger.error('Invalid vehicle')
            return {'status': 'error', 'message': 'Invalid vehicle'}, 400
        event_vehicle_id = event_vehicle.get('id', None)
        if not event_vehicle_id:
            app.logger.error('Invalid vehicle ID')
            return {'status': 'error', 'message': 'Invalid vehicle ID'}, 400

        event_type = data.get('eventType', None)
        if not event_type:
            app.logger.error('Invalid event type')
            return {'status': 'error', 'message': 'Invalid event type'}, 400

        # handle geofence events
        if event_type == 'GeofenceEntry':
            app.logger.info(f'Geofence entry event for vehicle {event_vehicle_id}')
            vehicles.append(event_vehicle_id)
        elif event_type == 'GeofenceExit':
            app.logger.info(f'Geofence exit event for vehicle {event_vehicle_id}')
            if event_vehicle_id in vehicles:
                vehicles.remove(event_vehicle_id)
            else:
                app.logger.warning(f'Vehicle {event_vehicle_id} not in geofence list')
        else:
            app.logger.error(f'Unknown event type: {event_type}')
            return {'status': 'error', 'message': 'Unknown event type'}, 400

    except Exception as e:
        print(e)
        return {'status': 'error', 'message': 'error processing'}, 400
    return {'status': 'success'}, 200

if __name__ == '__main__':
    app.run(debug=flask_debug, host=host, port=port)
