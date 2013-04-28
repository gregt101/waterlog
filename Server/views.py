#-*- encoding: utf-8 -*-
#!/usr/bin/env python

#import django libraries
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse, HttpResponseRedirect
from models import CheckIn, UserProfile
from datetime import datetime
from django.utils import timezone
from urllib2 import urlopen
import json

#waterlog.us/checkin?userid=matthewguitar89&time=1111111111111&fqloc=0923840923840948fe3&type=shower
#returns {}, or {'status':'ok'}

#waterlog.us/foursquare?lat=23984729834.432&lon=2938742384.234
#returns
# {'possible_locations': [('manhattan center','123123123fe3'), ('dunkin donuts','123123123123fe3')]}

#waterlog.us/recent?
#returns
# {'recent_checkins':[('matthew', 'toilet'), ('ryan', 'shower')]}

#waterlog.us/profile?userid=matthewguitar89
#returns
# {'picture':'www.picture.com', 'data':[(1,123), (2,234), (3,345)]}
# or
# {'status':'no such person :( '}

def home(request):
    c = {}
    return render_to_response('index.html', c, context_instance=RequestContext(request))


def fs_profile(request):
    if 'userid' not in request.GET:
        r = HttpResponse(json.dumps({'status':'no such person :( '}), content_type="application/json")
        r['Access-Control-Allow-Origin'] = '*'
        return r
    
    photo = json.loads(urlopen("https://api.foursquare.com/v2/users/" + request.GET['userid'] + "?oauth_token=JUNFTM24JVJONNRETUVTVAHJHDJQPQYCD3JCCH5EVRLKABZ0&v=20130427").read())
    photo = photo['response']['user']['photo']

    photo = (photo['prefix'], photo['suffix'])
    
    data = CheckIn.objects.filter(which_user_id=UserProfile.objects.get(foursquare_profile=request.GET['userid']).pk)
    usage = []
    running_total = 0
    for n, x in enumerate(data):
        if x.action_type == 'glass':
            running_total += 0.06
        #    usage.append((n, running_total + 0.06))
        if x.action_type == 'washingmachine':
            running_total += 35
        #    usage.append((n, running_total + 35))
        if x.action_type == 'toilet':
            running_total += 6
        #    usage.append((n, running_total + 6))
        if x.action_type == 'dishwasher':
            running_total += 15
        #    usage.append((n, running_total + 15))
        if x.action_type == 'shower':
            running_total += 7
        #    usage.append((n, running_total + 7))
        if x.action_type == 'bath':
            running_total += 30
        usage.append({'x':n, 'y':running_total})
    r = HttpResponse(json.dumps({'picture':photo, 'data':usage}), content_type="application/json")
    r['Access-Control-Allow-Origin'] = '*'
    return r 


def foursquare(request):
    needed = ['lat', 'long']
    for x in needed:
        if x not in request.GET:
            r = HttpResponse(json.dumps({'status':'error', 'message':'LatLong invalid :('}), content_type="application/json")
            r['Access-Control-Allow-Origin'] = '*'
            return r 
    
    latlong = request.GET['lat'] + ',' + request.GET['long']

    fsurl = "https://api.foursquare.com/v2/venues/search?ll=" + latlong
    fsurl += "&oauth_token=JUNFTM24JVJONNRETUVTVAHJHDJQPQYCD3JCCH5EVRLKABZ0&v=20130427"
    
    #optional search keyword
    fsurl += "&query=" + request.GET['kw'] if 'kw' in request.GET else ''
    
    fsdata = json.loads(urlopen(fsurl).read())
    locs = []
    for loc in fsdata['response']['venues']:
        locs.append({'name':loc['name'], 'id':loc['id']})
    
    r = HttpResponse(json.dumps({'possible_locations':locs}), content_type="application/json")
    r['Access-Control-Allow-Origin'] = '*'
    return r 

def building(request):
    if 'foursquare_location_id' not in request.GET:
        r = HttpResponse(json.dumps({'status':'invalid id'}), content_type="application/json")
        r['Access-Control-Allow-Origin'] = '*'
        return r 
    
    data = CheckIn.objects.filter(foursquare_location=request.GET['foursquare_location_id'])
    usage = []
    running_total = 0
    for n, x in enumerate(data):
        if x.action_type == 'glass':
            running_total += 0.06
        if x.action_type == 'washingmachine':
            running_total += 35
        if x.action_type == 'toilet':
            running_total += 6
        if x.action_type == 'dishwasher':
            running_total += 15
        if x.action_type == 'shower':
            running_total += 7
        if x.action_type == 'bath':
            running_total += 30
        usage.append((n, running_total))
    
    r = HttpResponse(json.dumps({'data':usage}), content_type="application/json")    
    r['Access-Control-Allow-Origin'] = '*'
    return r 

def checkin(request):
    #check that all variables are present
    needed = ['userid', 'time', 'fqloc', 'type']
    errors = {}
    for var in needed:
        if var not in request.GET:
            if 'empty_fields' not in errors.keys():
                errors['empty_fields'] = []
            errors['empty_fields'].append(var)
    
    if errors != {}:
        errors['status'] = 'error'
        r = HttpResponse(json.dumps(errors), content_type="application/json")
        r['Access-Control-Allow-Origin'] = '*'
        return r
    
    #check that userid exists
    user = UserProfile.objects.filter(foursquare_profile=request.GET['userid'])
    if len(user) != 1:
        user = create_user(request.GET['userid'])
        user = UserProfile.objects.get(pk=user[0])
    else:
        user = user[0]

    if errors != {}:
        errors['status'] = 'error'
        r = HttpResponse(json.dumps(errors), content_type="application/json")
        r['Access-Control-Allow-Origin'] = '*'
        return r 
    else:
        #everything is ok
        #save record to CheckIn
        ci = CheckIn.objects.create(which_user_id=user.pk)
        ci.foursquare_location = request.GET['fqloc']
        ci.action_type = request.GET['type']
        ci.time = datetime.fromtimestamp(float(request.GET['time']))
        ci.save()
        r = HttpResponse(json.dumps({'status':'ok'}), content_type="application/json")
        r['Access-Control-Allow-Origin'] = '*'
        r['X-FRAME-OPTIONS'] = "ALLOW_FROM http://appery.io/"
        return r 

def request_auth(request):
    redir = "http://appery.io/app/view/cc7604bf-7a24-471f-84f4-750aeb4afb9b/feed.html"
    #redir = "http://appery.io/app/view/cc7604bf-7a24-471f-84f4-750aeb4afb9b/feed.html"
    return HttpResponseRedirect("https://foursquare.com/oauth2/authenticate?client_id=L43LFSTUPVMYRPKLV0PDIFIFU0IHDHA5PLSX2CFZUYQRH322&response_type=token&redirect_uri=" + redir)

def letsgo(request):
    r = HttpResponse(json.dumps({'status':'sounds good'}), content_type="application/json")
    r['Access-Control-Allow-Origin'] = '*'
    return r 

def create_user(fsprofile):
    u = UserProfile.objects.create()
    u.time_created = datetime.now()
    u.foursquare_profile = fsprofile
    user_data = "https://api.foursquare.com/v2/users/" + fsprofile + "?oauth_token=JUNFTM24JVJONNRETUVTVAHJHDJQPQYCD3JCCH5EVRLKABZ0&v=20130428"
    u.username = json.loads(urlopen(user_data).read())['response']['user']['firstName']
    u.save()
    return (u.pk, u.foursquare_profile)


def recent(request):
    #get 100 most recent items
    recent = []
    recents = CheckIn.objects.all().order_by("-time")
    recentlen = len(recents)
    if recentlen > 10:
        recentlen = 10
        
    for x in range(recentlen):
        message = ""
        quantity = ""
        time = pretty_date(recents[x].time)
        u = UserProfile.objects.get(pk=recents[x].which_user_id).username
        
        
        if recents[x].action_type == 'glass':
            message = u + ' was thirsty. Chug!'
            quantity = "0.06 gallons"
        
        if recents[x].action_type == 'shower':
            message = u + ' took a shower'
            quantity = "7 gallons per minute"
            
        if recents[x].action_type == 'bath':
            message = u + ' took a long bath'
            quantity = "30 gallons"
        
        if recents[x].action_type == 'washingmachine':
            message = u + ' got rid of some stains'
            quantity = "35 gallons"
        
        
        if recents[x].action_type == 'dishwasher':
            message = u + ' did the dishes'
            quantity = "15 gallons"
        
        
        if recents[x].action_type == 'toilet':
            message = u + ' had a call of nature'
            quantity = "6 gallons"
        
        
        table = "<table><tr><td valign='middle'><img src='http://www.waterlog.us/static/" + recents[x].action_type + ".png" + "'></td>"
        table += "<td valign='middle'>"+message+"<br><span style='font-size:smaller;'>" + quantity + "</span></td></tr></table>"
        
        recent.append({
            'text':  table,
            'visible': 'true',
            'image': "http://www.waterlog.us/static/" + recents[x].action_type + ".png",
            #'quantity': quantity,
            #'timesince': time
            })
        
    r = HttpResponse(json.dumps({'recent_checkins':recent}), content_type="application/json")
    r['Access-Control-Allow-Origin'] = '*'
    return r 

def pretty_date(time=False):
    """
    Get a datetime object or a int() Epoch timestamp and return a
    pretty string like 'an hour ago', 'Yesterday', '3 months ago',
    'just now', etc
    """
    from datetime import datetime
    now = timezone.now()
    if type(time) is int:
        diff = now - datetime.fromtimestamp(time)
    elif isinstance(time,datetime):
        diff = now - time 
    elif not time:
        diff = now - now
    second_diff = diff.seconds
    day_diff = diff.days

    if day_diff < 0:
        return ''

    if day_diff == 0:
        if second_diff < 10:
            return "just now"
        if second_diff < 60:
            return str(second_diff) + " seconds ago"
        if second_diff < 120:
            return  "a minute ago"
        if second_diff < 3600:
            return str( second_diff / 60 ) + " minutes ago"
        if second_diff < 7200:
            return "an hour ago"
        if second_diff < 86400:
            return str( second_diff / 3600 ) + " hours ago"
    if day_diff == 1:
        return "Yesterday"
    if day_diff < 7:
        return str(day_diff) + " days ago"
    if day_diff < 31:
        return str(day_diff/7) + " weeks ago"
    if day_diff < 365:
        return str(day_diff/30) + " months ago"
    return str(day_diff/365) + " years ago"
    
    