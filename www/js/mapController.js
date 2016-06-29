'use strict';

angular.module('starter.controllers').controller('MapController', ['$scope', '$ionicHistory', 'Auth', 'GoogleMaps', function ($scope, $ionicHistory, Auth, GoogleMaps) {

  // $scope.Auth = Auth;
  $scope.GoogleMaps = GoogleMaps;

  // ionic.Platform.ready(function () {
  // });

  $scope.$on('$ionicView.enter', function () {
    $ionicHistory.clearHistory();
    $scope.GoogleMaps.loadMap();
  });
}]);