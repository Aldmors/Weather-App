from admincharts.admin import AdminChartMixin
from django.contrib import admin
from django.db.models import Count, Sum
from frontend_api.models import FavoriteLocations

from .models import AnonymousUserStats, LoggedUserStats


@admin.register(FavoriteLocations)
class FavoriteLocationsAdmin(AdminChartMixin, admin.ModelAdmin):
    list_chart_type = "line"
    list_display = ('location_name', 'owner', 'date_added')
    list_filter = ('location_name', 'owner', 'date_added')
    search_fields = ('location_name', 'owner__username')
    date_hierarchy = 'date_added'
    list_chart_options = {
        'responsive': True,
        'maintainAspectRatio': False,
        "scales": {
            "y": {
                "ticks": {
                    "stepSize": 1,
                },
                "beginAtZero": True,
            }
        }
    }

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
                    "backgroundColor": [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                    ],
                    "borderColor": [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",

                    ],
                    "borderWidth": 1,
                }
            ],
        }


@admin.register(AnonymousUserStats)
class AnonymousUserStatsAdmin(AdminChartMixin, admin.ModelAdmin):
    list_display = ('location', 'count')
    list_filter = ('location',)
    search_fields = ('location',)
    list_chart_type = "bar"
    list_chart_options = {
        'responsive': True,
        'maintainAspectRatio': False,
    }

    def get_list_chart_data(self, queryset):
        if not queryset:
            return {}

        stats_by_location = queryset.values('location').annotate(total_count=Sum('count')).order_by('-total_count')

        labels = [item['location'] for item in stats_by_location]
        totals = [item['total_count'] for item in stats_by_location]

        return {
            "labels": labels,
            "datasets": [
                {
                    "label": "Anonymous Searches",
                    "data": totals,
                    "backgroundColor": "rgba(255, 99, 132, 0.2)",
                    "borderColor": "rgba(255, 99, 132, 1)",
                    "borderWidth": 1,
                }
            ],
        }


@admin.register(LoggedUserStats)
class LoggedUserStatsAdmin(AdminChartMixin, admin.ModelAdmin):
    list_display = ('user', 'location', 'count')
    list_filter = ('user', 'location')
    search_fields = ('user__username', 'location')
    list_chart_type = "bar"
    list_chart_options = {
        'responsive': True,
        'maintainAspectRatio': False,
    }

    def get_list_chart_data(self, queryset):
        if not queryset:
            return {}

        stats_by_location = queryset.values('location').annotate(total_count=Sum('count')).order_by('-total_count')

        labels = [item['location'] for item in stats_by_location]
        totals = [item['total_count'] for item in stats_by_location]

        return {
            "labels": labels,
            "datasets": [
                {
                    "label": "Logged User Searches",
                    "data": totals,
                    "backgroundColor": "rgba(54, 162, 235, 0.2)",
                    "borderColor": "rgba(54, 162, 235, 1)",
                    "borderWidth": 1,
                }
            ],
        }
