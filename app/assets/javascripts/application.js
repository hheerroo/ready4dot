// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

function getGeocode(address, resultsMap) {
  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
      makeMarker(resultsMap, results[0].geometry.location)
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function getGeolocation(map) { 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        
        //Latlng(=pos) 활용
        makeInfoWindow(map, pos, 'Location found.')
        makeMarker(map, pos)
        map.setCenter(pos);

        }, function() {
            makeInfoWindow(map, map.center(), 'Error: The Geolocation service failed.')
        });
    } else {
        // Browser doesn't support Geolocation
        makeInfoWindow(map, map.center(), 'Error: Your browser doesn\'t support geolocation.')
    }
}

//make marker and moving map's center
function makeMarker(map, latlng){
    var marker = new google.maps.Marker({map: map});
    marker.setPosition(latlng); 
}

function makeInfoWindow(map, latlng, content){
    var infoWindow = new google.maps.InfoWindow({map: map});
    infoWindow.setPosition(latlng);
    infoWindow.setContent(content);
}