var map;

      // Create a new blank array for all the listing markers.
      var markers = [];
      var locations = [
      {title: "Buckingham Palace",streetAddress: "Westminster, London SW1A 1AA", location: { lat: 51.501364, lng: -0.141890}},
      {title: "Big Ben London", streetAddress: "Westminster, London SW1A 0AA", location: {lat: 51.500729  , lng: -0.124625}},
      {title: "London Eye", streetAddress: "Lambeth, London SE1 7PB", location: {lat: 51.503324 , lng: -0.119543}},
      {title: "Madame Tussauds London",streetAddress: "Marylebone Rd, Marylebone, London NW1 5LR", location: { lat: 51.522890 , lng: -0.154967}},
      {title: "National Maritime Museum",streetAddress: "Park Row, Greenwich, London SE10 9NF" ,location: { lat: 51.480875 , lng: -0.005289}},
      {title: "Tower of London", streetAddress: "St Katharine's & Wapping, London EC3N 4AB" , location: {lat: 51.508112 , lng : -0.075949}},
      {title: "St Paul's Cathedral", streetAddress: "St. Paul's Churchyard, London EC4M 8AD" , location: {lat: 51.513845 , lng : -0.098351}},
      {title: "Westminister Abbey ", streetAddress: "20 Deans Yd, Westminster, London SW1P 3PA" , location: {lat: 51.499292, lng : -0.127310 }},
      {title: "The British Museum", streetAddress: "Great Russell St, Bloomsbury, London WC1B 3DG" , location: {lat: 51.519413 , lng : -0.126957 }}

   ];


      function initMap() {

        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 51.501364, lng: -0.141890},
          zoom: 12,
          styles: styles,
          mapTypeControl: false
        });


    }

var viewModel = function() {

    var self = this;

// observables for storing markers in an Array and SearchBox (Query) from HTML

    this.markersArray = ko.observableArray([]);
    this.searchBox = ko.observable("");
// Storing all the locations object into markersArray

    for (var i = 0; i < locations.length; i++) {
        self.markersArray.push(locations[i]);
        console.log("Iam inside MARKERS ARRAY");
    }

    // filters the places array when searched in a query input
    this.searchSites = ko.computed(function() {
        q = self.searchBox().toLowerCase();
        if (self.searchBox()==="") {
            visible();
            return self.markersArray();
            console.log("Iam inside VM IF");
        } else {
            hideListings();
            // KnockOut Function for Filtering an array 
            return ko.utils.arrayFilter(self.markersArray(), function (location) {
                
                if (location.title.toLowerCase().indexOf(q) >= 0) {
                    location.googleMarker.setMap(map);
                   return location;
                }

            });
        }
    });

}

// If Google Map Api is not loading
function mapErrorHandler() {
    document.getElementById('map').innerHTML = "Error in Google Maps, Please refresh and try again";
}