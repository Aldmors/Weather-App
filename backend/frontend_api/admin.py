from django.contrib import admin
from .models import FavoriteLocations


class FavoriteLocationsAdmin(admin.ModelAdmin):
    list_display = ('location_name', 'owner', 'date_added')
    list_filter = ('location_name', 'owner', 'date_added')
    search_fields = ('location_name', 'owner__username')
    date_hierarchy = 'date_added'

admin.site.register(FavoriteLocations, FavoriteLocationsAdmin)
