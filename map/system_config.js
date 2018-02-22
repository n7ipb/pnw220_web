/*
* Gather data from multiple sites
* There has to be a better way than to hammer 
* multiple sites.
*/
var jsonEventUrl_78 = 'http://lyman-78.wetnet.net:1535/json';
var jsonEventUrl_66 = 'http://gold-66.wetnet.net:1535/json';
var jsonEventUrl_CP = 'http://cp-440-500.wetnet.net:1535/json';
var jsonEventUrl_EL = 'http://wetnet.net:1535/json';
var jsonEventUrl_BF = 'http://k7duh.wetnet.net:1535/json';


/* 
* Colors for signals
*/
var colors = {
    closed: "gray",
    open: "yellow",
    active: "green",
    transmit: "red"
}

/*
* HYBRID 	This map type displays a transparent layer of major streets on satellite images.
* ROADMAP 	This map type displays a normal street map.
* SATELLITE 	This map type displays satellite images.
* TERRAIN 	This map type displays maps with physical features such as terrain and vegetation.
*/

var mapOptions = {
    center: new google.maps.LatLng(47.50,-122.8),
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    streetViewControl: true,
    mapTypeControl: true
}

/* For future use */
var HawaiimapOptions = {
    center: new google.maps.LatLng(20.50,-157.0),
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    streetViewControl: true,
    mapTypeControl: true
}
var transmitters = {
    "type": "FeatureCollection",
    "features": [
    {
        "id":"TX_Lyman",
        "type": "Feature",
        "sitename": "Lyman Hill",
        "callsign": "N7RIG",
        "frequency": "224.780Mhz",
        "offset": "-1.6Mhz",
        "ctcss":    "103.5",
        "geometry": {
            "type": "Point",
            "coordinates": [-122.159570,48.594534],
            "altitude": [4300],
            "correction": [1]
        },
        "properties": {
            "signal": "10",
            "squelch" : "closed"
        }
    },
        {
        "id":"TX_Gold",
        "type": "Feature",
        "sitename": "Gold Mt",
        "callsign": "N7IPB",
        "frequency": "224.660Mhz",
        "offset": "-1.6Mhz",
        "ctcss": "103.5",
        "description": "Linked to Lyman Hill and \nCapitol Peak via the Internet",
        "geometry": {
            "type": "Point",
            "coordinates": [-122.788031,47.548261],
            "altitude": [1760],
            "correction": [1]
        },
        "properties": {
            "signal": "10",
            "squelch" : "closed"
        }
    },
    {
        "id": "TX_Capitol",
        "type": "Feature",
        "sitename": "Capitol Peak",
        "callsign": "W7WRG",
        "frequency": "440.500Mhz",
        "offset": "+5Mhz",
        "ctcss": "110.9",
        "description": "RF Hub for Multiple repeaters \nLinked to Lyman Hill and \nGold Mt via the Internet",
        "geometry": {
            "type": "Point",
            "coordinates": [-123.138356,46.973206],
            "altitude": [2670],
            "correction": [1]
        },
        "properties": {
            "signal": "10",
            "squelch" : "closed"
        }
    },
   {
        "id":"TX_BawFaw",
        "type": "Feature",
        "sitename": "BawFaw",
        "callsign": "W7WRG",
        "frequency": "224.080Mhz",
        "offset": "-1.6Mhz",
        "ctcss": "103.5",
        "description": "(Boistfort Peak)\nRF Linked to Capitol Peak",
        "geometry": {
            "type": "Point",
            "coordinates": [-123.214167,46.487778],
            "altitude": [3100],
            "correction": [1]
        },
        "properties": {
            "signal": "10",
            "squelch" : "closed"
        }
    },
    ]
}

var receivers = {
    "type": "FeatureCollection",
    "features": [
    {
        "id":"RxRepeater",
        "type": "Feature",
        "sitename": "Lyman Hill",
        "callsign": "N7RIG",
        "frequency": "224.780Mhz",
        "offset": "-1.6Mhz",
        "ctcss":    "103.5",
        "description": "Linked to Gold Mt and \nCapitol Peak via the Internet\n",
        "geometry": {
            "type": "Point",
            "coordinates": [-122.159570,48.594534],
            "altitude": [4300],
            "correction": [1]
        },
        "properties": {
            "signal": "10",
            "squelch" : "closed"
        }
    },
    
    {
        "id":"RxRepeater66",
        "type": "Feature",
        "sitename": "Gold Mt",
        "callsign": "N7IPB",
        "frequency": "224.660Mhz",
        "offset": "-1.6Mhz",
        "ctcss": "103.5",
        "description": "Linked to Lyman Hill and \nCapitol Peak via the Internet",
        "geometry": {
            "type": "Point",
            "coordinates": [-122.788031,47.548261],
            "altitude": [1760],
            "correction": [1]
        },
        "properties": {
            "signal": "10",
            "squelch" : "closed"
        }
    },
    {
        "id": "RxRepeaterCapPk",
        "type": "Feature",
        "sitename": "Capitol Peak",
        "callsign": "W7WRG",
        "frequency": "440.500Mhz",
        "offset": "+5Mhz",
        "ctcss": "110.9",
        "description": "RF Hub for Multiple repeaters \nLinked to Lyman Hill and \nGold Mt via the Internet",
        "geometry": {
            "type": "Point",
            "coordinates": [-123.138356,46.973206],
            "altitude": [2670],
            "correction": [1]
        },
        "properties": {
            "signal": "10",
            "squelch" : "closed"
        }
    },
    {
        "id": "RxAllstar",
        "type": "Feature",
        "sitename": "Koloko Peak, Hawaii",
        "callsign": "KH6BFD",
        "frequency": "443.650Mhz",
        "offset": "+5Mhz",
        "ctcss": "100.0",
        "description": "Allstar Link from Capitol Peak",
        "geometry": {
            "type": "Point",
            "coordinates": [-124.900,46.730000],
            "altitude": [6000],
            "correction": [0.025]
        },
        "properties": {
            "signal": "10",
            "squelch" : "closed"
        }
    },
    
   {
        "id":"RxNetAtlas",
        "type": "Feature",
        "sitename": "FW Test",
        "callsign": "N7IPB",
        "frequency": "varies",
        "offset": "varies",
        "ctcss": "varies",
        "description": "Test system",
        "geometry": {
            "type": "Point",
            "coordinates": [-122.366590,47.30614],
            "altitude": [350],
            "correction": [1]
        },
        "properties": {
            "signal": "10",
            "squelch" : "closed"
        }
    },

    {
        "id":"RxNetElectra",
        "type": "Feature",
        "sitename": "FW Test",
        "callsign": "N7IPB",
        "frequency": "varies",
        "offset": "varies",
        "ctcss": "varies",
        "description": "Test system",
        "geometry": {
            "type": "Point",
            "coordinates": [-122.366590,47.30614],
            "altitude": [350],
            "correction": [1]
        },
        "properties": {
            "signal": "10",
            "squelch" : "closed"
        }
    },

    {
        "id":"RxNetK7DUH",
        "type": "Feature",
        "sitename": "Tenino",
        "callsign": "K7DUH",
        "frequency": "445.5",
        "offset": "Receiver only",
        "ctcss": "110.9",
        "description": "K7DUH test system",
        "geometry": {
            "type": "Point",
            "coordinates": [-122.810845,46.850638],
            "altitude": [450],
            "correction": [1]
        },
        "properties": {
            "signal": "10",
            "squelch" : "closed"
        }
    },

    
    {
        "id":"RxRepeaterBaldi",
        "type": "Feature",
        "sitename": "Baldi",
        "callsign": "W7WRG",
        "frequency": "224.880Mhz",
        "offset": "-1.6Mhz",
        "ctcss": "103.5",
        "description": "(Grass Mountain)\nRF Linked to Capitol Peak",
        "geometry": {
            "type": "Point",
            "coordinates": [-121.843117,47.218889],
            "altitude": [350],
            "correction": [1]
        },
        "properties": {
            "signal": "10",
            "squelch" : "closed"
        }
    },
    
    {
        "id":"RxRepeaterBawfaw",
        "type": "Feature",
        "sitename": "BawFaw",
        "callsign": "W7WRG",
        "frequency": "224.080Mhz",
        "offset": "-1.6Mhz",
        "ctcss": "103.5",
        "description": "(Boistfort Peak)\nRF Linked to Capitol Peak",
        "geometry": {
            "type": "Point",
            "coordinates": [-123.214167,46.487778],
            "altitude": [3100],
            "correction": [1]
        },
        "properties": {
            "signal": "10",
            "squelch" : "closed"
        }
    },
    {
        "id":"RxRepeaterHaystack",
        "type": "Feature",
        "sitename": "HayStack",
        "callsign": "W7WRG",
        "frequency": "224.580Mhz",
        "offset": "-1.6Mhz",
        "ctcss": "103.5",
        "description": "RF Linked to Capitol Peak",
        "geometry": {
            "type": "Point",
            "coordinates": [-121.750744,47.809236],
            "altitude": [3600],
            "correction": [1]
        },
        "properties": {
            "signal": "10",
            "squelch" : "closed"
        }
    },
    
    ]
}
