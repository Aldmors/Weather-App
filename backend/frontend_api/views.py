
from rest_framework import permissions
from .serializers import FavoriteLocationsSerializer
from .models import FavoriteLocations
from rest_framework.views import APIView
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsOwner
from weather_api import api_open_weather
#from django.conf.urls import url
from rest_framework_swagger.views import get_swagger_view

schema_view = get_swagger_view(title='Weather API')

class FavoriteLocationsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    def get(self, request):
        favorite_locations = FavoriteLocations.objects.all()
        serializer = FavoriteLocationsSerializer(favorite_locations, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = FavoriteLocationsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class FavoriteLocationsDetail(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    def get_object(self, pk):
        try:
            return FavoriteLocations.objects.get(pk=pk)
        except FavoriteLocations.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = FavoriteLocationsSerializer(snippet)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = FavoriteLocationsSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WeatherData(APIView):
    def get(self, request,  lat, lon, units="metric"):
        weather_data = api_open_weather.WeatherAPI()
        data = weather_data.get_weather(lat, lon, units)
        return Response(data)


class WeatherOverview(APIView):
    def get(self, request, lat, lon, weather_date="", units="metric"):
        weather_data = api_open_weather.WeatherAPI()
        data = weather_data.get_weather_overview_one_call(lat, lon, weather_date, units)
        return Response(data)

# class WeatherSummary(APIView):
#     def get(self, request, lat, lon, date, units="metric"):
#         weather_data = api_open_weather.WeatherAPI()
#         data = weather_data.get_weather_overview_one_call(lat, lon, date, units)
#         return Response(data)

