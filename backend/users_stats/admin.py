from django.contrib import admin
from frontend_api.models import FavoriteLocations
from admincharts.admin import AdminChartMixin
from django.db.models import Count

@admin.register(FavoriteLocations)
class FavoriteLocationsAdmin(AdminChartMixin, admin.ModelAdmin):
    list_chart_type = "bar"
    list_display = ('location_name', 'owner', 'date_added')
    list_filter = ('location_name', 'owner', 'date_added')
    search_fields = ('location_name', 'owner__username')
    date_hierarchy = 'date_added'

    def get_list_chart_data(self, queryset):
        if not queryset:
            return {}
        
        locations_by_name = queryset.values('location_name').annotate(total=Count('location_name')).order_by('-total')

        labels = [item['location_name'] for item in locations_by_name]
        totals = [item['total'] for item in locations_by_name]

        return {
            "labels": labels,
            "datasets": [
                {
                    "label": "Favorite Locations",
                    "data": totals,
                }
            ],
        }
