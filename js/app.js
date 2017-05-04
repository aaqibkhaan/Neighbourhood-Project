var map;

// Location Listings that will be show to the user.

var markers = [];
var locations = [{
        title: "Buckingham Palace",
        streetAddress: "Westminster, London SW1A 1AA",
        location: {
            lat: 51.501364,
            lng: -0.141890
        }
    },
    {
        title: "Big Ben London",
        streetAddress: "Westminster, London SW1A 0AA",
        location: {
            lat: 51.500729,
            lng: -0.124625
        }
    },
    {
        title: "London Eye",
        streetAddress: "Lambeth, London SE1 7PB",
        location: {
            lat: 51.503324,
            lng: -0.119543
        }
    },
    {
        title: "Madame Tussauds London",
        streetAddress: "Marylebone Rd, Marylebone, London NW1 5LR",
        location: {
            lat: 51.522890,
            lng: -0.154967
        }
    },
    {
        title: "National Maritime Museum",
        streetAddress: "Park Row, Greenwich, London SE10 9NF",
        location: {
            lat: 51.480875,
            lng: -0.005289
        }
    },
    {
        title: "Tower of London",
        streetAddress: "St Katharine's & Wapping, London EC3N 4AB",
        location: {
            lat: 51.508112,
            lng: -0.075949
        }
    },
    {
        title: "St Paul's Cathedral",
        streetAddress: "St. Paul's Churchyard, London EC4M 8AD",
        location: {
            lat: 51.513845,
            lng: -0.098351
        }
    },
    {
        title: "Westminister Abbey ",
        streetAddress: "20 Deans Yd, Westminster, London SW1P 3PA",
        location: {
            lat: 51.499292,
            lng: -0.127310
        }
    },
    {
        title: "The British Museum",
        streetAddress: "Great Russell St, Bloomsbury, London WC1B 3DG",
        location: {
            lat: 51.519413,
            lng: -0.126957
        }
    }

];


function initMap() {
    // Styles array for map by https://snazzymaps.com/

    var styles = [{
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [{
                    "visibility": "on"
                },
                {
                    "color": "#e0efef"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [{
                    "visibility": "on"
                },
                {
                    "hue": "#1900ff"
                },
                {
                    "color": "#c0e8e8"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{
                    "lightness": 100
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [{
                    "visibility": "on"
                },
                {
                    "lightness": 700
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{
                "color": "#7dcdcd"
            }]
        }
    ];

    // Constructor creates a new map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 51.501364,
            lng: -0.141890
        },
        zoom: 10,
        styles: styles,
        mapTypeControl: false
    });

    // Global Variable InfoWindow
    largeInfowindow = new google.maps.InfoWindow();


    // Style the markers a bit. This will be our listing marker icon.

    defaultIcon = makeMarkerIcon('FF0000');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    highlightedIcon = makeMarkerIcon('FFFF24');

    var bounds = new google.maps.LatLngBounds();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        var streetAddress = locations[i].streetAddress;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            streetAddress: streetAddress,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });



        marker.addListener('click', function() {
            var self = this;
            // Create an onclick event to open the large infowindow at each marker.
            populateInfoWindow(this, largeInfowindow);
            // Setting Animation of each Marker
            toggleBounce(this);
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
        markers.push(marker);
        bounds.extend(marker.position);

        locations[i].googleMarker = marker;

    }
    // Making sure Map fits within Bounds and  map display responsively
 google.maps.event.addDomListener(window, 'resize', function() {
  map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
});

    // Applying KnockOut 

    ko.applyBindings(new ViewModel());
}

function toggleBounce(markerref) {
    if (markerref.getAnimation() !== null) {
        markerref.setAnimation(null);
    } else {
        markerref.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            markerref.setAnimation(null);
        }, 2000);

    }
}


// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;

       var getFlickrImage = function () {
            // URL for making the AJAX request to the Flickr's Server
            var flickr_url = "https://api.flickr.com/services/rest/?" +
                "method=flickr.photos.search&" +
                "api_key=7d94577e4579425282f741c40563afb7&" +
                "per_page=10&format=json&nojsoncallback=1&text=";
            // Searching for the particular site name.
            flickr_url += encodeURIComponent(marker.title.trim());

            // Info Window Contruction
            var infoWindowContent = '<h3 class="b-color">' + "Attraction NAME    :   " + marker.title + "<br>" + "Attraction Address    :   " + marker.streetAddress + '</h3>';
            infoWindowContent += '<p class="strong-red"> Images Powered by Flickr: <p>';
            // JSON request to Flickr server
            $.getJSON(flickr_url, function(data) {
                // Rertive all the photos returned by the flickr API call
                $.each(data.photos.photo, function(i, item) {
                    // Url Pointing out to the image location to show the image
                    var img_url = 'https://farm' + item.farm +
                        '.staticflickr.com/' + item.server +
                        '/' + item.id + '_' +
                        item.secret + '.jpg';
                    // Adding the flickr image to the info window
                    infoWindowContent += '<img class="flickr-img" src="' + img_url + '">';
                    infowindow.setContent(infoWindowContent);

                });
            }).fail(function() {
                // This Message Display if Flickr API FAILS to lad
                infoWindowContent += 'Unable to load Flickr Images , Please try again later';
                infowindow.setContent(infoWindowContent);
            });

        }
        getFlickrImage();
        // Open the infowindow on the correct marker.
        map.panTo(marker.getPosition());
        infowindow.open(map, marker);

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });

    }
}

// This function will loop through the markers array and display them all.
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function visible() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}


// Knock OUt Js ViewModel Approach

var ViewModel = function() {
    var self = this;
    this.markersArray = ko.observableArray([]);
    this.searchBox = ko.observable('');

    // Copying all the locations data to Observable MarkersArray    
    for (var i = 0; i < locations.length; i++) {
        self.markersArray.push(locations[i]);
        console.log("Iam inside MARKERS ARRAY");
    }

    // Filters the markers array when search is performed in searchBox
    this.searchSites = ko.computed(function() {
        q = self.searchBox().toLowerCase();
        if (self.searchBox() === "") {
            visible();
            return self.markersArray();
        } else {
            hideListings();
            // KO filter array function
            return ko.utils.arrayFilter(self.markersArray(), function(location) {

                if (location.title.toLowerCase().indexOf(q) >= 0) {
                    location.googleMarker.setMap(map);
                    return location;
                }

            });
        }
    });
    // Displaying the info window when marker is clicked
    this.clickedMarker = function() {

        this.googleMarker.map.setCenter(this.googleMarker.position);
        this.googleMarker.map.setZoom(16);
        toggleBounce(this.googleMarker);
        populateInfoWindow(this.googleMarker, largeInfowindow);
    };

};
// Function for Google Error
function mapErrorHandler() {
    document.getElementById('map').innerHTML = "Google map API not working";
}