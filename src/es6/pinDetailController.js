angular.module('starter.controllers')
  .controller('PinDetailController', [
      '$scope', '$stateParams', '$sce', 'googleMapsKey', 'PinService',
      function($scope, $stateParams, $sce, googleMapsKey, PinService) {

    $scope.$on('$ionicView.enter', function() {
      // console.log($stateParams.pinId);

      PinService.approvedPins.$loaded().then(function(pinArray) {
        $scope.pin = pinArray.$getRecord($stateParams.pinId);
        if ($scope.pin) {
          $scope.trustedPinEmbedSrc = $sce.trustAsResourceUrl(
              'https://www.google.com/maps/embed/v1/place?q=place_id:' +
              $scope.pin.placeId +
              '&key=' + googleMapsKey);
        }
      });
    });
}]);
