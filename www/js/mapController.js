'use strict';

angular.module('starter.controllers').controller('MapController', ['$scope', '$cordovaGeolocation', '$ionicHistory', 'Auth', 'PinService', function ($scope, $cordovaGeolocation, $ionicHistory, Auth, PinService) {

  $scope.Auth = Auth;
  $scope.PinService = PinService;
  $scope.markers = [];
  $scope.infoWindow = new google.maps.InfoWindow();
  $scope.cordovaOptions = { timeout: 10000, enableHighAccuracy: true };

  $scope.initialize = function () {
    // $scope.Auth.$onAuthStateChanged(function (firebaseUser) {
    //   $scope.user = firebaseUser;
    // });

    PinService.approvedPins.$loaded().then(function (data) {
      $scope.pins = data;
      $cordovaGeolocation.getCurrentPosition($scope.cordovaOptions).then(function (position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.renderMap(latLng);
      }, function (error) {
        console.log("Could not get location, falling back", error);
        var latLng = new google.maps.LatLng(40.768037, -73.975705);
        $scope.renderMap(latLng);
      });
    });
  };

  $scope.renderMap = function (latLng) {
    var mapOptions = {
      center: latLng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    $scope.drawPins();
  };

  $scope.drawPins = function () {
    for (var i = 0; i < $scope.pins.length; i++) {
      var pin = $scope.pins[i];
      var markerOptions = {
        position: new google.maps.LatLng(pin.lat, pin.lng),
        map: $scope.map
      };

      if (pin.name) {
        markerOptions.title = pin.name;
      }

      var marker = new google.maps.Marker(markerOptions);
      $scope.attachInfoWindow(marker, pin);
      $scope.markers.push(marker);
    }
  };

  $scope.attachInfoWindow = function (marker, pin) {
    marker.addListener('click', function () {
      // console.log("\n\n\n opening window");
      $scope.infoWindow.close();
      $scope.infoWindow.setContent($scope.buildContentString(pin));
      $scope.infoWindow.open(map, marker);
    });
  };

  $scope.buildContentString = function (pin) {
    var output = '';
    if ($scope.user && $scope.PinService.isFavorite(pin, $scope.user.uid)) {
      output += '<i class="icon ion-ios-star energized"></i>';
    }
    if (pin.flagged) {
      output += '<i class="icon ion-ios-flag assertive pb-overlay-icon"></i>';
    }

    output += "<a class='map-info-titleLink' href='#/tab/mapPins/" + pin.$id + "'>" + (pin.name ? pin.name : pin.short_address) + "</a>";

    // todo: show icon if currently open
    // if (pin.opening_hours && pin.opening_hours.open_now) {
    // }
    output += "<div><a class='map-info-DirectionsLink' href='https://www.google.com/maps/place/" + pin.address + "'>Directions</a></div>";

    return "<div class='map-infoContent'>" + output + "</div>";
  };

  $scope.clearMarkers = function () {
    if (!$scope.markers) {
      return;
    }

    for (var i = 0; i < $scope.markers.length; i++) {
      google.maps.event.clearInstanceListeners($scope.markers[i]);
      $scope.markers[i].setMap(null);
    }
    $scope.markers = [];
  };

  ionic.Platform.ready(function () {
    $scope.initialize();
  });

  $scope.$on('$ionicView.enter', function () {
    $ionicHistory.clearHistory();
  });

  $scope.$on('$ionicView.leave', function () {
    // $scope.clearMarkers();
  });
}]);