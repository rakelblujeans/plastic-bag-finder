'use strict';

angular.module('starter.services').factory('ConnectivityMonitor', ['$rootScope', '$cordovaNetwork', function ($rootScope, $cordovaNetwork) {

  return {
    isOnline: function isOnline() {
      if (ionic.Platform.isWebView()) {
        return $cordovaNetwork.isOnline();
      } else {
        return navigator.onLine;
      }
    },

    ifOffline: function ifOffline() {
      if (ionic.Platform.isWebView()) {
        return !$cordovaNetwork.isOnline();
      } else {
        return !navigator.onLine;
      }
    }
  };
}]);