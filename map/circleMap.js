function circleMap(jQuery) {
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
     
    var RepeaterInfoWindow = new google.maps.InfoWindow({
        content: description,
        maxWidth: 300	
    });
    
    var EchoLinkTxWindow = new google.maps.InfoWindow({
        content: description,
        maxWidth: 100	
    });
    
    var EchoLinkStatusBoxText = document.createElement("div");
    EchoLinkStatusBoxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
    EchoLinkStatusBoxText.innerHTML = "Echolink users Online:";
    
    var EchoLinkStatusOptions = {
        content: EchoLinkStatusBoxText
        ,disableAutoPan: false
        ,maxWidth: 0
        ,pixelOffset: new google.maps.Size(-100, 0)
        ,zIndex: null
        ,boxStyle: { 
            background: ""
            ,opacity: 0.75
            ,width: "175px"
        }
        ,closeBoxMargin: "10px 2px 2px 2px"
        ,closeBoxURL: "https://www.google.com/intl/en_us/mapfiles/close.gif"
        ,infoBoxClearance: new google.maps.Size(1, 1)
        ,isHidden: false
        ,pane: "floatPane"
        ,enableEventPropagation: false
    };
    
    var EchoLinkTxMarker = new google.maps.Marker({
        position: {lat: 48.35 , lng: -123.159570},
        map: map,
        visible: false
    });
    
    var EchoLinkStatusMarker = new google.maps.Marker({
        position: {lat: 48.35 , lng: -123.159570},
        map: map,
        visible: false
    });
    
    var TowerImage = {
        url: 'tower.png',
        anchor: new google.maps.Point(13,2)
    };
    
    var EchoLinkInfoBox = new InfoBox(EchoLinkStatusOptions);
        
    /* Display an overlay map for Hawaii and KH6BFD's system
     * If I new how this would be a true inset map
     * that responded to proper coordinates
     * But I don't so I play games
     */
    var HawaiiImageBounds = {
        north: 47.250000,
        south: 46.500000,
        east: -124.500,
        west: -126.500
    };
    
    HawaiiOverlay = new google.maps.GroundOverlay(
        'Hawaiian-Islands.png',
        HawaiiImageBounds
    );
    
    HawaiiOverlay.setMap(map);
    
    for(var i in transmitters.features) {
        var feature = transmitters.features[i];    
        var coords = feature.geometry.coordinates;
        var latLng = new google.maps.LatLng(coords[1], coords[0]);
        var sitename = feature.sitename;
        var transmit_circle = new google.maps.Circle({
            center: latLng,
            radius: 10,
            strokeColor: 'red',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            fillColor: "red",
            fillOpacity: 0.45,
            map: map
        });
        
        feature.transmitcircle = transmit_circle;
    }
    
    for(var i in receivers.features) {
        var feature = receivers.features[i];
        var coords = feature.geometry.coordinates;
        var latLng = new google.maps.LatLng(coords[1], coords[0]);
        var sitename = feature.sitename;
        var callsign = feature.callsign;
        var frequency = feature.frequency;
        var offset = feature.offset;
        var ctcss = feature.ctcss;
        var altitude = feature.geometry.altitude;
        var description = sitename + "\nCallsign: " + callsign + "\nFrequency: " + frequency +
        "\nOffset: " + offset + "\nCTCSS: " + ctcss + "\nAltitude: " + altitude + "\n" + feature.description;
        
        var htmldescription = sitename + "<br>Callsign: " + callsign + "<br>Frequency: " + frequency +
        "<br>Offset: " + offset + "<br>CTCSS: " + ctcss + "<br>Altitude: " + altitude + "'<br>" + feature.description;
        
        
        var signal_circle = new google.maps.Circle({
            center: latLng,
            radius: 10,
            strokeColor: 'black',
            strokeOpacity: 1.0,
            strokeWeight: 1,
            fillColor: "black",
            fillOpacity: 0.45,
            map: map
        });
        
        var SiteMarker = new google.maps.Marker({
            position: latLng,
            map: map,
            icon: TowerImage,
            animation: google.maps.Animation.DROP,
            title: description
        });
        
        google.maps.event.addListener(SiteMarker, 'click', (function(SiteMarker,htmldescription,RepeaterInfoWindow) {
            return function() {
                RepeaterInfoWindow.setContent(htmldescription);
                RepeaterInfoWindow.open(map,SiteMarker);
                setTimeout(function(){RepeaterInfoWindow.close();}, '15000');
            };
        })(SiteMarker,htmldescription,RepeaterInfoWindow)); 
        
        feature.signalcircle = signal_circle;
        
        feature.SiteMarker = SiteMarker;
    }

    
    /*  This should be done differently since this requires
    *  individual lines for each repeater site 
    *  Ideally the web server should consolidate this
    *  for us.  That way each repeater site has only one 
    *  event stream connection and the load is less
    *  but I don't know how to do this yet
    */
    var jsonStream78 = new EventSource(jsonEventUrl_78)
    jsonStream78.onmessage = function (e) {
        parseMessage(e)
    }
    var jsonStream66 = new EventSource(jsonEventUrl_66)
    jsonStream66.onmessage = function (f) {
        parseMessage(f)
    }
    
    var jsonStreamCP = new EventSource(jsonEventUrl_CP)
    jsonStreamCP.onmessage = function (g) {
        parseMessage(g)
    }
    
    var jsonStreamEL = new EventSource(jsonEventUrl_EL)
    jsonStreamEL.onmessage = function (h) {
        parseMessage(h)
    }

    var jsonStreamBF = new EventSource(jsonEventUrl_BF)
    jsonStreamBF.onmessage = function (i) {
        parseMessage(i)
    }

    
    
    function parseMessage(e){
        var message = JSON.parse(e.data);
        
        
        switch (message.event) {
            
            /* Squelch open/closed and signal strength */
            case 'Voter:sql_state':
                
                for(var i in receivers.features) {
                    var feature = receivers.features[i];
                    var featureid = feature.id;
                    var receiver = message.rx[featureid];
                    if (undefined != receiver) {
                        var level = receiver.lvl;
                        /* Make circle really small when squelch is closed */
                        if (receiver.sql == 'closed') {
                            level = 1;
                            feature.SiteMarker.setAnimation(null);
                        } else {
                            feature.SiteMarker.setAnimation(google.maps.Animation.BOUNCE); 
                        }
                        feature.signalcircle.setOptions(
                            {
                                radius: getRadius(level, feature.geometry.altitude, feature.geometry.correction),
                                                        fillColor: colors[receiver.sql],
                            }
                        );
                    }	
                }
                break;
                
                /* Echolink clients connected */
                case 'EchoLink:clients':	
                    var clients = "Echolink users online:<br>" + message.clients;
                    if (typeof message.clients != 'undefined') {
                        EchoLinkStatusBoxText.innerHTML = clients;
                        EchoLinkInfoBox.open(map, EchoLinkStatusMarker);
                    } else {
                        EchoLinkInfoBox.close();
                    }              
                    break;
                    
                    /* Echolink user transmitting */
                    case 'EchoLink:is_receiving':	
                        /* Display an infobox if transmitting */
                        var callsign = "Echolink TX:<br>" + message.client;
                        if (message.rx == 1) {
                            EchoLinkTxWindow.setContent(callsign);
                            EchoLinkTxWindow.open(map,EchoLinkTxMarker);
                        } else {
                            EchoLinkTxWindow.close();
                        }              
                        break;
                        
                        /* 
                        * A repeater is transmitting
                        * 
                        * The use of 'rx' is dictated by the 
                        * messages generated by eventsource.pl on each repeater.
                        * This can be fixed in the future
                        */
                        case 'RepeaterLogic:tx_state':	
                            /* Display a red circle if transmitting */
                            
                            for(var i in transmitters.features) {
                                var feature = transmitters.features[i];
                                var featureid = feature.id;
                                var transmitter = message.rx[featureid];
                                if (undefined != transmitter) {
                                    /* Magic number to make the transmit radius reasonable */
                                    var radius = transmitter.lvl*10000;
                                    feature.transmitcircle.setOptions(
                                        {
                                            radius: radius,
                                            fillcolor: "red"
                                        }
                                    ); 
                                }
                            }
                            break;
                            
                        default:
        }
    }
}

/*
* get the circle radius to be displayed
*/
function getRadius(level, altitude, correction) {
    if(level < 0 ) {
        level = 0;
    }
    alt = (altitude * 0.3048) * correction;
    /* Calculate the diameter of the circle to be displayed
    *    It's based on the formula LOS (km) = 3.57 * square-root (altitude in meters)
    *    The circle api requires the radius in meters so we convert altitude 
    *    from feet to meters first.
    *	  The result is in KM so w convert to meters during the calculation 
    *    Because the formula seems a little  optomistic the formula is adjusted down */
    return  (((Math.sqrt(alt)* 3.00)) * (level * 10) );
}

