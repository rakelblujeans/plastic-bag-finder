'use strict';

/*
 * Taken the blog posts on
 * from http://www.joshmorony.com/monitoring-online-and-offline-states-in-an-ionic-application/
 */

angular.module('starter.services').factory('ConnectivityMonitor', ['$rootScope', '$cordovaNetwork', '$ionicLoading', function ($rootScope, $cordovaNetwork, $ionicLoading) {

  function enableInteraction() {
    $ionicLoading.hide();
  };

  function disableInteraction(msg) {
    $ionicLoading.show({
      template: msg ? msg : 'Uhhm, internet?'
    });
  };

  return {
    enableInteraction: enableInteraction,
    disableInteraction: disableInteraction,
    isOnline: function isOnline() {
      console.log('online: is webview', ionic.Platform.device());
      if (ionic.Platform.isWebView()) {
        console.log("is online", $cordovaNetwork.isOnline());
        return $cordovaNetwork.isOnline();
      } else {
        console.log("is online", navigator.onLine);
        return navigator.onLine;
      }
    },
    isOffline: function isOffline() {
      console.log('offline: is webview', ionic.Platform.device());
      if (ionic.Platform.isWebView()) {

        return !$cordovaNetwork.isOnline();
      } else {
        return !navigator.onLine;
      }
    },
    startWatching: function startWatching() {
      console.log('watching: is webview', ionic.Platform.device());
      if (ionic.Platform.isWebView()) {
        $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
          console.log("went online");
          enableInteraction();
        });

        $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
          disableInteraction();
          console.log("went offline");
        });
      } else {
        window.addEventListener("online", function (e) {
          enableInteraction();
          console.log("went online");
        }, false);

        window.addEventListener("offline", function (e) {
          disableInteraction();
          console.log("went offline");
        }, false);
      }
    }
  };
}]);