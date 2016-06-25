'use strict';

angular.module('starter.controllers').controller('MapController', function ($scope, PinService) {
  $scope.$on('$ionicView.enter', function () {
    initialize();
  });

  $scope.$on('$ionicView.leave', function () {
    clearMarkers();
  });

  function initialize() {
    $scope.PinService = PinService;
    $scope.pins = PinService.approvedPins;

    $scope.markers = [];
    $scope.infoWindow = new google.maps.InfoWindow();

    var myLatlng = new google.maps.LatLng(40.768037, -73.975705);
    var mapOptions = {
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    navigator.geolocation.getCurrentPosition(function (pos) {
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

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
    });
  };

  $scope.attachInfoWindow = function (marker, pin) {
    marker.addListener('click', function () {
      $scope.infoWindow.close();
      $scope.infoWindow.setContent($scope.buildContentString(pin));
      $scope.infoWindow.open(map, marker);
    });
  };

  $scope.buildContentString = function (pin) {
    var output = "<a class='map-info-titleLink' href='#/tab/pins/" + pin.$id + "'>" + (pin.name ? pin.name : pin.short_address) + "</a>";
    if (pin.opening_hours && pin.opening_hours.open_now) {}

    output += "<div><a class='map-info-DirectionsLink' href='https://www.google.com/maps/place/" + pin.address + "'>Directions</a></div>";
    // todo: show icon if currently open
    // show icon if favorited
    return "<div class='map-infoContent'>" + output + "</div>";
  };

  function clearMarkers() {
    for (var i = 0; i < $scope.markers.length; i++) {
      google.maps.event.clearInstanceListeners($scope.markers[i]);
      $scope.markers[i].setMap(null);
    }
    $scope.markers = [];
  }
});