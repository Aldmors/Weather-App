from rest_framework import serializers
from .models import FavoriteLocations
from django.contrib.auth.models import User

class FavoriteLocationsSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = FavoriteLocations
        fields = ('id', 'location_name', 'lat', 'lon', 'date_added', 'owner')

    def create(self, validated_data):
            return FavoriteLocations.objects.create(**validated_data)

    def update(self, instance, validated_data):
            instance.location_name = validated_data.get('location_name', instance.location_name)
            instance.lat = validated_data.get('lat', instance.lat)
            instance.lon = validated_data.get('lon', instance.lon)
            instance.date_added = validated_data.get('date_added', instance.date_added)
            instance.owner = validated_data.get('owner', instance.user)
            instance.save()
            return instance
