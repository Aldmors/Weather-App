import os
import requests
from django.http import HttpResponse
import dotenv


dotenv.load_dotenv()


class WeatherAPI:
    def __init__(self):
        self.api_key =  os.getenv('WEATHER_KEY')
        self.base_url = "https://api.openweathermap.org/data/3.0/onecall"

    def get_weather(self, lat, lon, units="metric"):
        """
        Get weather data for a given latitude and longitude.
        """
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self.api_key,
            "units": units,
        }
        response = requests.get(self.base_url, params=params)
        return response.json()

    def get_current_weather(self, lat, lon, units="metric"):
        """
        Get the current weather data.
        """
        weather_data = self.get_weather(lat, lon, units)
        return weather_data.get("current")

    def get_forecast_weather(self, lat, lon, units="metric"):
        """
        Get the forecast weather data.
        """
        weather_data = self.get_weather(lat, lon, units)
        return {
            "hourly": weather_data.get("hourly"),
            "daily": weather_data.get("daily"),
        }

    def get_weather_overview(self, lat, lon, units="metric"):
        """
        Get a brief overview of the weather.
        """
        current_weather = self.get_current_weather(lat, lon, units)
        if not current_weather:
            return None
        
        overview = {
            "timestamp": current_weather.get("dt"),
            "temp": current_weather.get("temp"),
            "feels_like": current_weather.get("feels_like"),
            "weather": current_weather.get("weather")[0].get("main") if current_weather.get("weather") else None,
            "weather_description": current_weather.get("weather")[0].get("description") if current_weather.get("weather") else None,
        }
        return overview
