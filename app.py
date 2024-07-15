from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({'error': 'City parameter is required'}), 400

    api_key = 'API_KEY'  # Substitua pelo seu API key do OpenWeatherMap
    api_url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&lang=pt_br&units=metric'

    response = requests.get(api_url)
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch data from OpenWeatherMap'}), response.status_code

    data = response.json()
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
