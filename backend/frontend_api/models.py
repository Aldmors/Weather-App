from django.db import models
from weather_api.api_geocoding import GeoCodesAPI


class FavoriteLocations(models.Model):
    location_name = models.CharField(max_length=50)
    lat = models.FloatField()
    lon = models.FloatField()
    date_added = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(
        "auth.User", related_name="favoritelocations", on_delete=models.CASCADE
    )

    def save(self, *args, **kwargs):
        geocoding_api = GeoCodesAPI()
        location_data = geocoding_api.get_coords_by_location(self.location_name)
        if location_data:
            self.lat = location_data[0]['lat']
            self.lon = location_data[0]['lon']
        super().save(*args, **kwargs)
