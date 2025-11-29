from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path("favorite_locations/", views.FavoriteLocationsView.as_view()),
    path("favorite_locations/detail/<int:id>/", views.FavoriteLocationsDetail.as_view()),
    path("weather/<str:lat>/<str:lon>/", views.WeatherData.as_view()),
    path("weather/overview/<str:lat>/<str:lon>/<str:weather_date>/", views.WeatherOverview.as_view()),
    path("geocoding/", views.GeocodingView.as_view()),

    # path("weather/summary/<str:lat>/<str:lon>/<str:date>/", views.WeatherSummary.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
