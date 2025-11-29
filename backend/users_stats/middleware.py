from .models import AnonymousUserStats, LoggedUserStats


class LocationStatsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.path == '/weather/':
            location = request.GET.get('location')
            if location:
                if request.user.is_authenticated:
                    stats, created = LoggedUserStats.objects.get_or_create(
                        user=request.user,
                        location=location
                    )
                    stats.count += 1
                    stats.save()
                else:
                    stats, created = AnonymousUserStats.objects.get_or_create(
                        location=location
                    )
                    stats.count += 1
                    stats.save()
        return response
