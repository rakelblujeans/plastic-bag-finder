/*
 * Taken the blog posts on
 * from http://www.joshmorony.com/monitoring-online-and-offline-states-in-an-ionic-application/
 */

angular.module('starter.services')
  .factory('ConnectivityMonitor', ['$rootScope', '$cordovaNetwork', '$ionicLoading',
    function($rootScope, $cordovaNetwork, $ionicLoading) {

return {
    enableInteraction: function() {
      $ionicLoading.hide();
    },
    disableInteraction: function() {
      $ionicLoading.show({
        template: 'Uhhm, internet?'
      });
    },
    isOnline: function() {
      // console.log('online: is webview', ionic.Platform.isWebView(), ionic.Platform.device());
      if(ionic.Platform.isWebView()) {
        return $cordovaNetwork.isOnline();
      } else {
        return navigator.onLine;
      }
    },
    isOffline: function() {
      // console.log('offline: is webview', ionic.Platform.isWebView(), ionic.Platform.device());
      if(ionic.Platform.isWebView()) {

        return !$cordovaNetwork.isOnline();
      } else {
        return !navigator.onLine;
      }
    },
    startWatching: function() {
      // console.log('watching: is webview', ionic.Platform.isWebView(), ionic.Platform.device());
        if(ionic.Platform.isWebView()) {
          $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
            // console.log("went online");
          });

          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
            // console.log("went offline");
          });

        }
        else {
          window.addEventListener("online", function(e) {
            // console.log("went online");
          }, false);

          window.addEventListener("offline", function(e) {
            // console.log("went offline");
          }, false);
        }
    }
  }
  }]);
