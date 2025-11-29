from drf_yasg.utils import swagger_auto_schema
from rest_framework import permissions
from .serializers import FavoriteLocationsSerializer
from .models import FavoriteLocations
from rest_framework.views import APIView
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsOwner
from weather_api import api_open_weather
from weather_api.api_geocoding import GeoCodesAPI
from django.core.cache import cache

from rest_framework_swagger.views import get_swagger_view

schema_view = get_swagger_view(title='Weather API')

class FavoriteLocationsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    def get(self, request):
        favorite_locations = FavoriteLocations.objects.filter(owner=request.user)
        serializer = FavoriteLocationsSerializer(favorite_locations, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=FavoriteLocationsSerializer)
    def post(self, request, format=None):
        serializer = FavoriteLocationsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FavoriteLocationsDetail(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    
    def get_object(self, id, user):
        try:
            return FavoriteLocations.objects.get(pk=id, owner=user)
        except FavoriteLocations.DoesNotExist:
            raise Http404

    def get(self, request, id):
        snippet = self.get_object(id, request.user)
        serializer = FavoriteLocationsSerializer(snippet)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=FavoriteLocationsSerializer)
    def put(self, request, id, format=None):
        snippet = self.get_object(id, request.user)
        serializer = FavoriteLocationsSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id, format=None):
        snippet = self.get_object(id, request.user)
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WeatherData(APIView):
    def get(self, request,  lat, lon, units="metric"):
        # Create a cache key based on lat, lon, and units
        cache_key = f'weather_data_{lat}_{lon}_{units}'
        

        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return Response(cached_data)

        weather_data = api_open_weather.WeatherAPI()
        data = weather_data.get_weather(lat, lon, units)
        

        cache.set(cache_key, data)
        
        return Response(data)


class WeatherOverview(APIView):
    def get(self, request, lat, lon, weather_date="", units="metric"):
        # Create a cache key based on lat, lon, weather_date, and units
        cache_key = f'weather_overview_{lat}_{lon}_{weather_date}_{units}'
        

        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return Response(cached_data)

        weather_data = api_open_weather.WeatherAPI()
        data = weather_data.get_weather_overview_one_call(lat, lon, weather_date, units)

        cache.set(cache_key, data, timeout=600)
        
        return Response(data)


class GeocodingView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        location_name = request.query_params.get('q', '')
        if not location_name:
            return Response({'error': 'Missing location name parameter (q)'}, status=status.HTTP_400_BAD_REQUEST)
        
        geocoding_api = GeoCodesAPI()
        location_data = geocoding_api.get_coords_by_location(location_name)
        
        if not location_data or len(location_data) == 0:
            return Response({'error': 'Location not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(location_data[0])

# class WeatherSummary(APIView):
#     def get(self, request, lat, lon, date, units="metric"):
#         weather_data = api_open_weather.WeatherAPI()
#         data = weather_data.get_weather_overview_one_call(lat, lon, date, units)
#         return Response(data)
