angular.module('starter.services')
  .factory('GoogleMaps', [
    '$cordovaGeolocation', 'GoogleMapsLoader', 'PinService',
    function($cordovaGeolocation, GoogleMapsLoader, PinService) {
      var apiKey = false;
      var map = null;
      var markers = [];
      var infoWindow = null;

      function setMapWithLocation(latLng) {
        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // Wait until the map is loaded
        google.maps.event.addListenerOnce(map, 'idle', function() {
          loadMarkers();
          // ConnectivityMonitor.enableInteraction();
        });

        google.maps.event.addListener(map, 'click', function() {
          closeInfoWindow();
        });
      };

      function closeInfoWindow() {
        if (infoWindow) {
          infoWindow.close();
        }
      }

      function initMap() {
        var options = {timeout: 10000, enableHighAccuracy: true};
        $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
          var latLng = new google.maps.LatLng(
              position.coords.latitude, position.coords.longitude);
          setMapWithLocation(latLng);
        }, function(error){
          console.log("Could not get location, falling back on default location");
          var latLng = new google.maps.LatLng(40.768037, -73.975705);
          setMapWithLocation(latLng);
        });
      }

      function clearMarkers() {
        if (!markers.length) {
          return;
        }

        for (var i = 0; i < markers.length; i++) {
          google.maps.event.clearInstanceListeners(markers[i]);
          markers[i].setMap(null);
        }
        markers.length = 0;
      }

      function loadMarkers() {
        PinService.approvedPins.$loaded().then(function(pins) {
          // console.log("Pins: ", pins);
          for (var i = 0; i < pins.length; i++) {
            var pin = pins[i];
            var pinPos = new google.maps.LatLng(pin.lat, pin.lng);

            var marker = new google.maps.Marker({
              map: map,
              animation: google.maps.Animation.DROP,
              position: pinPos
            });
            markers.push(marker);

            addInfoWindow(marker, buildContentString(pin), pin);
          }
        });
      }

      // todo: define html in code
      function buildContentString(pin) {
        var output = '';
        // if ($scope.user && $scope.PinService.isFavorite(pin, $scope.user.uid)) {
        //   output += '<i class="icon ion-ios-star energized"></i>';
        // }
        if (pin.flagged) {
          output += '<i class="icon ion-ios-flag assertive pb-overlay-icon"></i>';
        }

        output += "<a class='map-info-titleLink' href='#/tab/mapPins/" + pin.$id + "'>" +
            (pin.name ? pin.name : pin.short_address) + "</a>";

        // todo: show icon if currently open
        // if (pin.opening_hours && pin.opening_hours.open_now) { }
        output += "<div><a class='map-info-DirectionsLink' href='https://www.google.com/maps/place/"
            + pin.address + "'>Directions</a></div>";

        return "<div class='map-infoContent'>" + output + "</div>";
      }

      function addInfoWindow(marker, message, record) {
        infoWindow = new google.maps.InfoWindow({
          content: message
        });

        google.maps.event.addListener(marker, 'click', function() {
          closeInfoWindow();
          infoWindow.open(map, marker);
        });
      }

      return {
        loadMap: function() {
          GoogleMapsLoader.init(initMap);
        },
        reloadMarkers: function() {
          clearMarkers();
          loadMarkers();
        }
      }
  }]);
