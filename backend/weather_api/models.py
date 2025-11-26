from django.db import models
from django.contrib.auth.models import User


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