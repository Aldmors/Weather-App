import os

import dotenv
import requests

dotenv.load_dotenv()


class GeoCodesAPI:
    def __init__(self):
        self._api_key = os.getenv('WEATHER_KEY_ONE_CALL')

        self.base_url = "http://api.openweathermap.org/geo/1.0/"

    def get_coords_by_location(self, city_name, state_code="", country_code="", limit=1):
        """
        Get coordinates by location name.
        """
        q_param = f"{city_name},{state_code},{country_code}"
        params = {
            "q": q_param,
            "limit": limit,
            "appid": self._api_key,
        }
        response = requests.get(f"{self.base_url}direct", params=params)
        return response.json()

    def get_coords_by_zip(self, zip_code, country_code="US"):
        """
        Get coordinates by zip/post code.
        """
        zip_param = f"{zip_code},{country_code}"
        params = {
            "zip": zip_param,
            "appid": self._api_key,
        }
        response = requests.get(f"{self.base_url}zip", params=params)
        return response.json()

# api = GeoCodesAPI()
# print(api.get_coords_by_location("Kraków"))
