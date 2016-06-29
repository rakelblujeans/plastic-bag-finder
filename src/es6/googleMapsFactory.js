angular.module('starter.services')
  .factory('GoogleMaps', function($cordovaGeolocation, $ionicLoading,
      $rootScope, $cordovaNetwork, ConnectivityMonitor, googleMapsKey, PinService) {

    var apiKey = false;
    var map = null;

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
        enableMap();
      });
    };

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

    function enableMap() {
      $ionicLoading.hide();
    }

    function disableMap() {
      $ionicLoading.show({
        template: 'You must be connected to the Internet to view this map.'
      });
    }

    function loadGoogleMaps() {
      $ionicLoading.show({
        template: 'Loading Google Maps'
      });

      // This function will be called once the SDK has been loaded
      window.googleMapsCb = function() {
        initMap();
      };

      // Create a script element to insert into the page
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.id = "googleMaps";

      // Note the callback function in the URL is the one we created above
      if(apiKey) {
        script.src = 'http://maps.google.com/maps/api/js?key=' + apiKey
            + '&callback=googleMapsCb';
      }
      else {
        script.src = 'http://maps.google.com/maps/api/js?callback=googleMapsCb';
      }

      document.body.appendChild(script);
    }

    function checkLoaded() {
      if (typeof google == "undefined" || typeof google.maps == "undefined") {
        loadGoogleMaps();
      } else {
        enableMap();
      }
    }

    function loadMarkers() {
      // Get all of the markers from our Markers factory
      // Markers.getMarkers().then(function(markers) {
      PinService.approvedPins.$loaded().then(function(pins) {
        console.log("Pins: ", pins);
        // var records = markers.data.result;
        for (var i = 0; i < pins.length; i++) {
          var pin = pins[i];
          var pinPos = new google.maps.LatLng(pin.lat, pin.lng);

          // Add the markerto the map
          var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: pinPos
          });

          addInfoWindow(marker, buildContentString(pin), pin);
        }
      });
    }

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
      output += "<div><a class='map-info-DirectionsLink' href='https://www.google.com/maps/place/" +
          pin.address + "'>Directions</a></div>";

      return "<div class='map-infoContent'>" + output + "</div>";
    }

    function addInfoWindow(marker, message, record) {
      var infoWindow = new google.maps.InfoWindow({
        content: message
      });

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
      });
    }

    function addConnectivityListeners() {
      if(ionic.Platform.isWebView()) {
        // Check if the map is already loaded when the user comes online,
        // if not, load it
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
          checkLoaded();
        });

        // Disable the map when the user goes offline
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
          disableMap();
        });
      }
      else {
        //Same as above but for when we are not running on a device
        window.addEventListener("online", function(e) {
          checkLoaded();
        }, false);

        window.addEventListener("offline", function(e) {
          disableMap();
        }, false);
      }

    }

    return {
      init: function() { // key
        // if(typeof key != "undefined"){
          apiKey = googleMapsKey;
        // }
        if (typeof google == "undefined" || typeof google.maps == "undefined") {
          console.warn("Google Maps SDK needs to be loaded");
          disableMap();
          if(ConnectivityMonitor.isOnline()) {
            loadGoogleMaps();
          }
        }
        else {
          if(ConnectivityMonitor.isOnline()) {
            initMap();
            enableMap();
          } else {
            disableMap();
          }
        }

        addConnectivityListeners();
      }
    }
  });

