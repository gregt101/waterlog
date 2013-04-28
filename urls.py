from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',

    #info
    url(r'^$', 'waterlog.views.home', name='home'),
    
    #foursquare integration
    url(r'^request_auth', 'waterlog.views.request_auth', name='request_auth'),
    url(r'^letsgo', 'waterlog.views.letsgo', name='letsgo'),
    
    #checkin apis
    url(r'^checkin', 'waterlog.views.checkin', name='checkin'),
    url(r'^recent', 'waterlog.views.recent', name='recent'),
    url(r'^foursquare', 'waterlog.views.foursquare', name='foursquare'),
    url(r'^profile', 'waterlog.views.fs_profile', name='profile'),
    url(r'^building', 'waterlog.views.building', name='building'),
)
