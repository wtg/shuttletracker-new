from flask import Flask, request, send_from_directory, jsonify
from pathlib import Path
import os
from apscheduler.schedulers.background import BackgroundScheduler
import requests

flask_debug = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
production = os.environ.get('FLASK_ENV', 'development').lower() == 'production'
port = int(os.environ.get('PORT', 3000))
host = os.environ.get('FLASK_HOST', '0.0.0.0')

app = Flask(
    __name__,
    static_folder='../client/dist/',
    static_url_path='/'
)

vehicles = ['281474977371235', '281474979530259', '281474987547650', '281474993785467', '281474993829898']
latest_locations = {}

def update_locations():
    global latest_locations
    global vehicles
    if not vehicles:
        app.logger.info('No vehicles to update')
        return
    api_key = os.environ.get('API_KEY')
    if not api_key:
        app.logger.error('API_KEY not set')
        return
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Accept': 'application/json',
    }
    url_params = {
        'vehicleIds': ','.join(vehicles),
        'types': 'gps',
    }
    url = 'https://api.samsara.com/fleet/vehicles/stats/feed'

    try:
        response = requests.get(url, headers=headers, params=url_params)
        if response.status_code == 200:
            data = response.json()
            api_data = data.get('data', None)
            if not api_data:
                app.logger.error('Invalid data')
                return
            for vehicle in api_data:
                vehicle_id = vehicle.get('id', None)
                if not vehicle_id:
                    app.logger.error('Invalid vehicle ID')
                    continue
                gps_data = vehicle.get('gps', [None])[0]
                if not gps_data:
                    app.logger.error('Invalid GPS data')
                    continue
                if vehicle_id not in vehicles:
                    app.logger.warning(f'Vehicle {vehicle_id} not in geofence list')
                    continue
                latest_locations[vehicle_id] = {
                    'lat': gps_data.get('latitude', None),
                    'lng': gps_data.get('longitude', None),
                    'timestamp': gps_data.get('time', None),
                    'speed': gps_data.get('speedMilesPerHour', None),
                    'heading': gps_data.get('headingDegrees', None),
                    'address': gps_data.get('reverseGeo', {}).get('formattedLocation', ''),
                }
            app.logger.info(f'Updated locations: {latest_locations}')
        else:
            app.logger.error(f'Error fetching locations: {response.status_code} {response.text}')
    except requests.RequestException as e:
        app.logger.error(f'Error fetching locations: {e}')


scheduler = BackgroundScheduler()

@app.route('/')
@app.route('/schedule')
def serve_react():
    root_dir = Path(app.static_folder)
    return send_from_directory(root_dir, 'index.html')

@app.route('/api/locations', methods=['GET'])
def get_locations():
    global latest_locations
    return jsonify(latest_locations)

@app.route('/api/webhook', methods=['POST'])
def webhook():
    global vehicles
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
                latest_locations.pop(event_vehicle_id, None)
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
    scheduler.start()
    scheduler.add_job(update_locations, trigger="interval", seconds=5)
    app.run(debug=flask_debug, host=host, port=port)
