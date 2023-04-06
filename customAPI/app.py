from flask import Flask, request, jsonify
import datetime
import jsonschema
from recommendation import get_recommendations
from collaborativefiltering import get_collaborative
from itinerary import get_itinerary
from search import get_locations
from getAllLocations import get_all_locations

app = Flask(__name__)

# Define JSON schema for input data
input_schema = {
    "type": "object",
    "properties": {
        "destination": {"type": "string"},
        "time": {"type": "integer", "minimum": 0},
        "budget": {"type": "integer", "minimum": 0},
        "preference": {"type": "list"}
    },
    "required": ["destination", "time", "preference"]
}

@app.route('/generate', methods=['GET', 'POST'])
def generate():
    if request.method == 'GET':
        # Handle GET requests
        print('Generating recommendations...')
        # Validate input data against JSON schema
        try:
            jsonschema.validate(request.get_json(), input_schema)
        except jsonschema.ValidationError as e:
            return jsonify({'error': 'Invalid input data: {}'.format(e)}), 400
        

        data = request.get_json()
        destination = data['destination']
        time = data['time']
        preference_trip = data['preference']
        # Use UTC time
        now = datetime.datetime.utcnow()

        # Generate response
        response = [
            {
                'destination': destination,
                'start_date': now.strftime("%Y-%m-%d %H:%M:%S"),
                'end_date': (now + datetime.timedelta(days=int(time))).strftime("%Y-%m-%d %H:%M:%S")
            }
        ]
        return jsonify({'recommendations': response})
    
    elif request.method == 'POST':
        # Handle POST requests
        try:
            # Parse request data
            data = request.get_json()
            destination = data['destination']
            time = data['time']
            try:
                budget = data['budget'] 
            except:
                budget = 100000
            preference_trip = data['preference']
        except (KeyError, TypeError):
            # Handle missing or invalid data
            error_message = 'Invalid or missing data'
            return jsonify({'error': error_message}), 400

        #Get the recommendations according to destination, preferance and number of days
        recommendations, total_budget = get_recommendations(destination,preference_trip,time,budget)

        # Use UTC time
        now = datetime.datetime.utcnow()

        # Generate response
        response = [
            {
                'destination': recommendations,
                'total_budget': total_budget
            }
        ]
        return jsonify({'recommendations': response})
    else:
        # Handle unsupported HTTP methods
        return jsonify({'error': 'HTTP method not supported'}), 405

@app.route('/collaborative', methods=['GET', 'POST'])
def collaborative():
    if request.method == 'GET':
        # Handle GETrequests
        try:
            # Parse request data
            data = request.get_json()
            destination = data['location'] 
            ratings = data['ratings']
        except (KeyError, TypeError):
            # Handle missing or invalid data
            error_message = 'Invalid or missing data'
            return jsonify({'error': error_message}), 400

        #Get the collaborative recommendations according to destination
        recommendations = get_collaborative(destination,ratings)

        # Return response
        return jsonify({'recommendations': recommendations})
    
    elif request.method == 'POST':
        # Handle POST requests
        try:
            # Parse request data
            data = request.get_json()
            destination = data['location'] 
            ratings = data['ratings']
        except (KeyError, TypeError):
            # Handle missing or invalid data
            error_message = 'Invalid or missing data'
            return jsonify({'error': error_message}), 400

        #Get the collaborative recommendations according to destination
        recommendations = get_collaborative(destination,ratings)

        # Return response
        return jsonify({'recommendations': recommendations})
    else:
        # Handle unsupported HTTP methods
        return jsonify({'error': 'HTTP method not supported'}), 405
    
@app.route('/itinerary', methods=['GET', 'POST'])
def itinerary():
    if request.method == 'GET':
        # Handle POST requests
        try:
            # Parse request data
            data = request.get_json()
            locations = data['locations']
        except (KeyError, TypeError):
            # Handle missing or invalid data
            error_message = 'Invalid or missing data'
            return jsonify({'error': error_message}), 400

        #Get the generated itinerary according to selected locations
        itinerary, itinerary_budget = get_itinerary(locations)

        # Generate response
        response = [
            {
                'destination': itinerary,
                'total_budget': int(itinerary_budget)
            }
        ]
        return jsonify({'recommendations': response})
    
    elif request.method == 'POST':
        # Handle POST requests
        try:
            # Parse request data
            data = request.get_json()
            locations = data['locations']
        except (KeyError, TypeError):
            # Handle missing or invalid data
            error_message = 'Invalid or missing data'
            return jsonify({'error': error_message}), 400

        #Get the generated itinerary according to selected locations
        itinerary, itinerary_budget = get_itinerary(locations)

        # Generate response
        response = [
            {
                'destination': itinerary,
                'total_budget': int(itinerary_budget)
            }
        ]
        return jsonify({'recommendations': response})
    else:
        # Handle unsupported HTTP methods
        return jsonify({'error': 'HTTP method not supported'}), 405
    
@app.route('/search', methods=['GET', 'POST'])
def search():
    if request.method == 'GET':
        # Handle GETrequests
        try:
            # Parse request data
            data = request.get_json()
            location = data['location']
        except (KeyError, TypeError):
            # Handle missing or invalid data
            error_message = 'Invalid or missing data'
            return jsonify({'error': error_message}), 400

        #Get the destination based on destination
        recommendations = get_locations(location)

        # Return response
        return jsonify({'recommendations': recommendations})
    
    elif request.method == 'POST':
        # Handle POST requests
        try:
            # Parse request data
            data = request.get_json()
            location = data['location']
        except (KeyError, TypeError):
            # Handle missing or invalid data
            error_message = 'Invalid or missing data'
            return jsonify({'error': error_message}), 400

        #Get the destination based on destination
        recommendations = get_locations(location)

        # Return response
        return jsonify({'recommendations': recommendations})
    else:
        # Handle unsupported HTTP methods
        return jsonify({'error': 'HTTP method not supported'}), 405
    
@app.route('/get_locations', methods=['GET', 'POST'])
def get_entire_locations():
    if request.method == 'GET':
        # # Handle GETrequests

        #Get all locations
        recommendations = get_all_locations()
        
        # Return response
        return jsonify({'recommendations': recommendations})
    
if __name__ == '__main__':
    app.run()