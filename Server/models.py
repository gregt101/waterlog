from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    username = models.TextField(blank=True, null=True)
    foursquare_profile = models.TextField(blank=True, null=True)
    time_created = models.DateTimeField(blank=True, null=True)

class CheckIn(models.Model):
    which_user = models.ForeignKey(UserProfile)
    time = models.DateTimeField(blank=True, null=True)
    action_type = models.TextField(blank=True, null=True)
    foursquare_location = models.TextField(blank=True, null=True)
