from flask import Flask, request, send_from_directory
from pathlib import Path
import os

flask_debug = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
production = os.environ.get('FLASK_ENV', 'development').lower() == 'production'
port = int(os.environ.get('PORT', 3001))
host = os.environ.get('FLASK_HOST', '0.0.0.0')

app = Flask(
    __name__,
    static_folder='../client/dist/',
    static_url_path='/'
)

vehicles = []
latest_locations = []

@app.route('/')
@app.route('/<path:path>')
def serve_react(path=''):
    root_dir = Path(app.static_folder)
    file_path = root_dir / path

    if file_path.exists() and file_path.is_file():
        return send_from_directory(root_dir, path)
    else:
        return send_from_directory(root_dir, 'index.html')

@app.route('/api/locations', methods=['GET'])
def get_locations():
    global latest_locations
    return {'locations': latest_locations}

@app.route('/api/webhook', methods=['POST'])
def webhook():
    '''
    Example request body:
    {
        'eventId': 'e3645383-32f1-4c66-a5e6-983b2e456e77',
        'eventMs': 1600796684212,
        'eventType': 'Alert',
        'event': {
            'alertEventUrl': 'https://cloud.samsara.com/o/53729/alerts/incidents/v2/159469/1/281474977075805/1600796684212/link?dl=NDA5ZjU2OGUtYzhmMi00N2IzLWJmNDktMDU0YmJiYTY0YTg0OlJ1Uk9BaExjYklMSHdDWmRZdFJnYzR1alJaRlFmbXBw',
            'alertConditionDescription': 'Vehicle is inside geofence',
            'alertConditionId': 'DeviceLocationInsideGeofence',
            'details': ''Little Red' is inside Garage.',
            'device': {
            'id': 281474977075805,
            'name': 'Little Red',
            'serial': 'G9MTH7CNKZ',
            'vin': 'JTMBK32V895081147'
            },
            'orgId': 53729,
            'resolved': false,
            'startMs': 1600796604125,
            'summary': ''Little Red' is inside Garage.'
        }
    }
    '''
    global latest_locations
    data = request.json
    if not data:
        return {'status': 'error', 'message': 'Invalid JSON'}, 400
    try:
        if data['event']['alertConditionId'] == 'DeviceLocationInsideGeofence':
            vehicles.append(data['event']['device']['id'])
        elif data['event']['alertConditionId'] == 'DeviceLocationOutsideGeofence':
            if data['event']['device']['id'] in vehicles:
                vehicles.remove(data['event']['device']['id'])
            else:
                print('ALERT: Vehicle exited geofence but not in vehicles list')
    except Exception as e:
        print(e)
        return {'status': 'error', 'message': 'error processing'}, 400
    return {'status': 'success'}, 200

if __name__ == '__main__':
    app.run(debug=flask_debug, host=host, port=port)
