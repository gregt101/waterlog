/*
 * JS for profile generated by Appery.io
 *
 * Created on: Sunday, April 28, 2013, 07:14:41 AM (PDT)
 */

/* Setting project environment indicator */
Appery.env = "apk";

Appery.getProjectGUID = function() {
    return 'cc7604bf-7a24-471f-84f4-750aeb4afb9b';
}

Appery.getTargetPlatform = function() {
    return 'W';
}

function navigateTo(outcome, useAjax) {
    Appery.navigateTo(outcome, useAjax);
}

function adjustContentHeight() {
    Appery.adjustContentHeight();
}

function adjustContentHeightWithPadding() {
    Appery.adjustContentHeightWithPadding();
}

function setDetailContent(pageUrl) {
    Appery.setDetailContent(pageUrl);
}

/*
 * Service settings
 */
var Foursquare_Settings = {
    "client_id": "L43LFSTUPVMYRPKLV0PDIFIFU0IHDHA5PLSX2CFZUYQRH322",
    "redirect_uri": "http://appery.io/app/view/cc7604bf-7a24-471f-84f4-750aeb4afb9b/feed.html"
}

/*
 * Services
 */
var checkinlist = new Appery.RestService({
    'url': 'http://waterlog.us/foursquare?lat=40.7142&long=74.0064',
    'dataType': 'json',
    'type': 'get',
});
var waterlog_profile = new Appery.RestService({
    'url': 'http://www.waterlog.us/profile',
    'dataType': 'json',
    'type': 'get',
});
var recent = new Appery.RestService({
    'url': 'http://waterlog.us/recent',
    'dataType': 'json',
    'type': 'get',
});
var Foursquare_UserAPI = new Appery.RestService({
    'url': 'https://api.foursquare.com/v2/users/self',
    'dataType': 'json',
    'type': 'get',
});

//createSpinner("res/lib/jquerymobile/images/ajax-loader.gif");
Appery.AppPages = [{
    "name": "SurveyResults",
    "location": "SurveyResults.html"
}, {
    "name": "checkin_activity",
    "location": "checkin_activity.html"
}, {
    "name": "Page7",
    "location": "Page7.html"
}, {
    "name": "Page6",
    "location": "Page6.html"
}, {
    "name": "Page4",
    "location": "Page4.html"
}, {
    "name": "Page5",
    "location": "Page5.html"
}, {
    "name": "checkin_list",
    "location": "checkin_list.html"
}, {
    "name": "stats",
    "location": "stats.html"
}, {
    "name": "profile",
    "location": "profile.html"
}, {
    "name": "Foursquare_Signin",
    "location": "Foursquare_Signin.html"
}, {
    "name": "Graph",
    "location": "Graph.html"
}, {
    "name": "buildinfo",
    "location": "buildinfo.html"
}, {
    "name": "Foursquare_User",
    "location": "Foursquare_User.html"
}, {
    "name": "Page3",
    "location": "Page3.html"
}, {
    "name": "Page2",
    "location": "Page2.html"
}, {
    "name": "auth",
    "location": "auth.html"
}, {
    "name": "Page1",
    "location": "Page1.html"
}, {
    "name": "feed",
    "location": "feed.html"
}];

j_105_js = function(runBeforeShow) { /* Object & array with components "name-to-id" mapping */
    var n2id_buf = {
        'mobilenavbar_11': 'j_108',
        'mobilenavbaritem_12': 'j_109',
        'mobilenavbaritem_13': 'j_110',
        'mobilenavbaritem_14': 'j_111',
        'mobilegrid_24': 'j_115',
        'mobilegridcell_25': 'j_116',
        'mobileimage_17': 'j_117',
        'mobilegridcell_26': 'j_118',
        'mobilelabel_31': 'j_119',
        'mobilelabel_32': 'j_120',
        'panel_15': 'j_113',
        'mobilebutton_16': 'j_114'
    };

    if ("n2id" in window && window.n2id !== undefined) {
        $.extend(n2id, n2id_buf);
    } else {
        window.n2id = n2id_buf;
    }

    Appery.CurrentScreen = 'j_105';

    /*
     * Nonvisual components
     */
    var datasources = [];

    waterlog_profile2 = new Appery.DataSource(waterlog_profile, {
        'onComplete': function(jqXHR, textStatus) {

            $t.refreshScreenFormElements("j_105");
        },
        'onSuccess': function(data) {
            console.log(waterlog_profile2.data.data);
            renderD3Chart(waterlog_profile2.data.data);
        },
        'onError': function(jqXHR, textStatus, errorThrown) {},
        'responseMapping': [],
        'requestMapping': [{
            'PATH': ['userid'],
            'ATTR': '25609564'
        }]
    });

    datasources.push(waterlog_profile2);

    /*
     * Events and handlers
     */
    j_105_beforeshow = function() {
        Appery.CurrentScreen = 'j_105';
        for (var idx = 0; idx < datasources.length; idx++) {
            datasources[idx].__setupDisplay();
        }
    }
    // screen onload
    screen_6601_onLoad = j_105_onLoad = function() {
        screen_6601_elementsExtraJS();
        try {
            waterlog_profile2.execute({})
        } catch (ex) {
            console.log(ex.name + '  ' + ex.message);
            hideSpinner();
        };

        j_105_deviceEvents();
        j_105_windowEvents();
        screen_6601_elementsEvents();
    }

    // screen window events
    screen_6601_windowEvents = j_105_windowEvents = function() {
        $('#j_105').bind('pageshow orientationchange', function() {
            adjustContentHeightWithPadding();
        });

    }

    // device events
    j_105_deviceEvents = function() {

        document.addEventListener("deviceready", function() {

        });
    }

    // screen elements extra js
    screen_6601_elementsExtraJS = j_105_elementsExtraJS = function() {
        // screen (screen-6601) extra code

    }

    // screen elements handler
    screen_6601_elementsEvents = j_105_elementsEvents = function() {

        $("a :input,a a,a fieldset label").live({
            click: function(event) {
                event.stopPropagation();
            }
        });

        $('#j_107 [name="mobilenavbaritem_12"]').die().live({
            click: function() {
                if (!$(this).attr('disabled')) {
                    Appery.navigateTo('feed', {
                        reverse: false
                    });

                }
            },
        });
        $('#j_107 [name="mobilenavbaritem_13"]').die().live({
            click: function() {
                if (!$(this).attr('disabled')) {
                    Appery.navigateTo('stats', {
                        transition: 'slide',
                        reverse: true
                    });

                }
            },
        });

    }

    $("#j_105").die("pagebeforeshow").live("pagebeforeshow", function(event, ui) {
        j_105_beforeshow();
    });

    if (runBeforeShow) {
        j_105_beforeshow();
    } else {
        j_105_onLoad();
    }

}

$("#j_105").die("pageinit").live("pageinit", function(event, ui) {
    Appery.processSelectMenu($(this));
    j_105_js();
});