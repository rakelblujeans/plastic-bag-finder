angular.module('starter.services')
  .factory('ConnectivityMonitor', ['$rootScope', '$cordovaNetwork',
      function($rootScope, $cordovaNetwork) {

    return {
      isOnline: function(){
        if(ionic.Platform.isWebView()){
          return $cordovaNetwork.isOnline();
        } else {
          return navigator.onLine;
        }
      },

      ifOffline: function(){
        if(ionic.Platform.isWebView()){
          return !$cordovaNetwork.isOnline();
        } else {
          return !navigator.onLine;
        }
      }
    }
  }]);
