from django.db import models

from backend.frontend_api.models import User


class FavoriteLocations(models.Model):
    location_name = models.CharField(max_length=50)
    lat = models.FloatField()
    lon = models.FloatField()
    date_added = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Weather(models.Model):
    location = models.CharField(max_length=50, blank=True)
    lat = models.FloatField(blank=True)
    lon = models.FloatField(blank=True)
    date = models.DateTimeField()
    time = models.TimeField()
    temp = models.FloatField()
    feels_like = models.FloatField()
    temp_min = models.FloatField()
    temp_max = models.FloatField()
    pressure = models.IntegerField()
    humidity = models.IntegerField()
    wind_speed = models.FloatField()