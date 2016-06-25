'use strict';

angular.module('starter.controllers').controller('PinDetailController', function ($scope, $stateParams, $sce, googleMapsKey, PinService) {

  $scope.$on('$ionicView.enter', function () {
    $scope.pins = PinService.approvedPins;
    $scope.pin = $scope.pins.$getRecord($stateParams.pinId);
    if ($scope.pin) {
      $scope.trustedPinEmbedSrc = $sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/place?q=place_id:' + $scope.pin.placeId + '&key=' + googleMapsKey);
    }
  });
});