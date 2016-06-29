'use strict';

angular.module('starter.controllers').controller('MapController', [
    '$scope', '$ionicHistory', 'Auth', 'GoogleMaps',
    function($scope, $ionicHistory, Auth, GoogleMaps) {

  // $scope.Auth = Auth;
  $scope.GoogleMaps = GoogleMaps;

  // must happen here - want this to load as early as possible
  ionic.Platform.ready(function () {
    $scope.GoogleMaps.loadMap();
  });

  $scope.$on('$ionicView.enter', function () {
    $ionicHistory.clearHistory();
  });
}]);
