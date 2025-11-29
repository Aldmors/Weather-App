from django.contrib import admin
from frontend_api.models import FavoriteLocations
from admincharts.admin import AdminChartMixin
from django.db.models import Count

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
            "options": {
                "plugins": {
                    "title": {
                        "display": True,
                        "text": 'Favorite Locations Chart'
                    }
                },

            }
        }
