// angular.module('starter.services')
//   .factory('GooglePlace', function($cordovaGeolocation, $ionicLoading,
//       $rootScope, $cordovaNetwork, ConnectivityMonitor, googleMapsKey, PinService) {

//     var apiKey = false;
//     var map = null;
//     var markers = [];

//     // function setMapWithLocation(latLng) {
//     // var mapOptions = {
//     //     center: latLng,
//     //     zoom: 15,
//     //     mapTypeId: google.maps.MapTypeId.ROADMAP
//     //   };

//     //   map = new google.maps.Map(document.getElementById("map"), mapOptions);

//     //   // Wait until the map is loaded
//     //   google.maps.event.addListenerOnce(map, 'idle', function() {
//     //     loadMarkers();
//     //     enableMap();
//     //   });
//     // };

//     // function initMap() {
//     //   var options = {timeout: 10000, enableHighAccuracy: true};
//     //   $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
//     //     var latLng = new google.maps.LatLng(
//     //         position.coords.latitude, position.coords.longitude);
//     //     setMapWithLocation(latLng);
//     //   }, function(error){
//     //     console.log("Could not get location, falling back on default location");
//     //     var latLng = new google.maps.LatLng(40.768037, -73.975705);
//     //     setMapWithLocation(latLng);
//     //   });
//     // }

//     function enableMap() {
//       $ionicLoading.hide();
//     }

//     function disableMap() {
//       $ionicLoading.show({
//         template: 'Uhhm, internet?'
//       });
//     }

//     function loadGoogleMaps(postLoadCb) {
//       $ionicLoading.show({
//         template: 'Loading Google Maps'
//       });

//       // This function will be called once the SDK has been loaded
//       window.googleMapsCb = function() {
//         postLoadCb();
//       };

//       // Create a script element to insert into the page
//       var script = document.createElement("script");
//       script.type = "text/javascript";
//       script.id = "googleMaps";

//       // Note the callback function in the URL is the one we created above
//       if(apiKey) {
//         script.src = 'http://maps.google.com/maps/api/js?key=' + apiKey
//             + '&callback=googleMapsCb';
//       }
//       else {
//         script.src = 'http://maps.google.com/maps/api/js?callback=googleMapsCb';
//       }

//       document.body.appendChild(script);
//     }

//     function checkLoaded() {
//       if (typeof google == "undefined" || typeof google.maps == "undefined") {
//         loadGoogleMaps();
//       } else {
//         enableMap();
//       }
//     }

//     function addConnectivityListeners() {
//       if(ionic.Platform.isWebView()) {
//         // Check if the map is already loaded when the user comes online,
//         // if not, load it
//         $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
//           checkLoaded();
//         });

//         // Disable the map when the user goes offline
//         $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
//           disableMap();
//         });
//       }
//       else {
//         //Same as above but for when we are not running on a device
//         window.addEventListener("online", function(e) {
//           checkLoaded();
//         }, false);

//         window.addEventListener("offline", function(e) {
//           disableMap();
//         }, false);
//       }

//     }

//     return {
//       init: function(postLoadCb) {
//         apiKey = googleMapsKey;

//         if (typeof google == "undefined" || typeof google.maps == "undefined") {
//           console.warn("Google Maps SDK needs to be loaded");
//           disableMap();
//           if(ConnectivityMonitor.isOnline()) {
//             loadGoogleMaps();
//           }
//         }
//         else {
//           if (ConnectivityMonitor.isOnline()) {
//             postLoadCb();
//             enableMap();
//           } else {
//             disableMap();
//           }
//         }

//         addConnectivityListeners();
//       },

//     }
//   });
"use strict";