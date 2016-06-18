'use strict';

angular.module('starter.controllers').controller('ManagePinsController', function ($scope) {
  $scope.pins = [];

  $scope.$on('$ionicView.enter', function () {
    // initialize();
  });

  function initialize() {};
});