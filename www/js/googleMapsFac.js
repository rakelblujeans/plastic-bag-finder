'use strict';

angular.module('starter.services').factory('GoogleMapsLoader', function ($ionicLoading, $rootScope, $cordovaNetwork, ConnectivityMonitor, googleMapsKey) {

  var apiKey = false;
  var postLoadCallback = null;

  function enableInteraction() {
    $ionicLoading.hide();
  }

  function disableInteraction() {
    $ionicLoading.show({
      template: 'Uhhm, internet?'
    });
  }

  function loadGoogleMaps() {
    $ionicLoading.show({
      template: 'Loading Google Maps'
    });

    // This function will be called once the SDK has been loaded
    window.googleMapsCb = function () {
      if (postLoadCallback) {
        postLoadCallback();
      }
    };

    // Create a script element to insert into the page
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "googleMaps";

    // Note the callback function in the URL is the one we created above
    if (apiKey) {
      script.src = 'http://maps.google.com/maps/api/js?key=' + apiKey + '&callback=googleMapsCb';
    } else {
      script.src = 'http://maps.google.com/maps/api/js?callback=googleMapsCb';
    }

    document.body.appendChild(script);
  }

  function checkLoaded() {
    if (typeof google == "undefined" || typeof google.maps == "undefined") {
      loadGoogleMaps();
    } else {
      enableInteraction();
    }
  }

  function addConnectivityListeners() {
    if (ionic.Platform.isWebView()) {
      // Check if the map is already loaded when the user comes online,
      // if not, load it
      $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
        checkLoaded();
      });

      // Disable the map when the user goes offline
      $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
        disableInteraction();
      });
    } else {
      //Same as above but for when we are not running on a device
      window.addEventListener("online", function (e) {
        checkLoaded();
      }, false);

      window.addEventListener("offline", function (e) {
        disableInteraction();
      }, false);
    }
  }

  return {
    init: function init(postLoadCb) {
      apiKey = googleMapsKey;
      postLoadCallback = postLoadCb;

      if (typeof google == "undefined" || typeof google.maps == "undefined") {
        console.warn("Google Maps SDK needs to be loaded");
        disableInteraction();
        if (ConnectivityMonitor.isOnline()) {
          loadGoogleMaps();
        }
      } else {
        if (ConnectivityMonitor.isOnline()) {
          postLoadCb();
          enableInteraction();
        } else {
          disableInteraction();
        }
      }

      addConnectivityListeners();
    }

  };
});