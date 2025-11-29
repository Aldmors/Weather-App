from django.contrib.auth.models import User
from django.db import models


class AnonymousUserStats(models.Model):
    location = models.CharField(max_length=255)
    count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Anonymous stats for {self.location}"


class LoggedUserStats(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=255)
    count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} stats for {self.location}"
