import os
import requests
from django.http import HttpResponse
import dotenv
from datetime import datetime
import json

dotenv.load_dotenv()


class WeatherAPI:
    def __init__(self):
        # self._api_key =  os.getenv('WEATHER_KEY')
        self._api_onecall_key = os.getenv('WEATHER_KEY_ONE_CALL')
        self.base_url = "https://api.openweathermap.org/data/3.0/onecall"
        self.base_url_2_5 = "https://api.openweathermap.org/data/2.5/weather"

    def get_weather(self, lat, lon, units="metric"):
        """
        Get weather data for a given latitude and longitude.
        """
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self._api_onecall_key,
            "units": units,
        }
        response = requests.get(self.base_url, params=params)
        return response.json()

    def get_weather_overview_one_call(self, lat, lon, weather_date="", units="metric"):
        """
        Get weather overview from One Call API 3.0 overview endpoint.
        """
        overview_url = f"{self.base_url}/overview"
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self._api_onecall_key,
            "date": weather_date,
            "units": units,
        }
        response = requests.get(overview_url, params=params)
        return response.json()

#Taki sam wynik jak overview
    # def get_day_summary(self, lat, lon, date, units="metric"):
    #     """
    #     Get weather data for a given latitude and longitude.
    #     """
    #     params = {
    #         "lat": lat,
    #         "lon": lon,
    #         "date": date,
    #         "appid": self._api_onecall_key,
    #         "units": units,
    #     }
    #     response = requests.get(f"{self.base_url}/day_summary", params=params)
    #     return response.json()
    #
    #
    # def get_current_weather_by_coords_2_5(self, lat, lon, units="metric"):
    #     """
    #     Get current weather data for a given latitude and longitude from API 2.5.
    #     """
    #     params = {
    #         "lat": lat,
    #         "lon": lon,
    #         "appid": self._api_key,
    #         "units": units,
    #     }
    #     response = requests.get(self.base_url_2_5, params=params)
    #     return response.json()
    #
    # def get_current_weather_by_city_name_2_5(self, city_name, units="metric"):
    #     """
    #     Get current weather data for a given city name from API 2.5.
    #     """
    #     params = {
    #         "q": city_name,
    #         "appid": self._api_key,
    #         "units": units,
    #     }
    #     response = requests.get(self.base_url_2_5, params=params)
    #     return response.json()


#
# api = WeatherAPI()
# y = json.dumps(api.get_weather("50.0619474", "19.9368564"))
# print(y)

# print(api.get_current_weather_by_city_name_2_5("Kraków"))