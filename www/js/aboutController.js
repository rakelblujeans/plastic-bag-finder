'use strict';

angular.module('starter.controllers').controller('SplashController', function ($scope, Auth, UserService) {
  $scope.Auth = Auth;
  $scope.UserService = UserService;

  // $scope.$on('$ionicView.enter', function() {
  // });

  $scope.login = function () {
    $scope.UserService.login();
  };

  $scope.logout = function () {
    $scope.UserService.logout();
  };

  $scope.closeAccount = function () {
    $scope.UserService.closeAccount();
  };
});