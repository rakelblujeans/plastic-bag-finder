angular.module('starter.controllers')
  .controller('PinsController', function($scope, PinService) {
    $scope.newPin = {};
    $scope.PinService = PinService;
    $scope.pins = PinService.pins;
    $scope.addPanelExpanded = false;

    $scope.$on('$ionicView.enter', function() {
      // Create the autocomplete helper, and associate it with
      // an HTML text input box.
      var input = (document.getElementById('placeQuery'));
      $scope.autocomplete = new google.maps.places.Autocomplete(input);
      // Get the full place details when the user selects a place from the
      // list of suggestions.
      google.maps.event.addListener($scope.autocomplete, 'place_changed', $scope.onPlaceChanged);
    });

    $scope.onPlaceChanged = function () {
      var place = $scope.autocomplete.getPlace();
      if (place.geometry) {
        $scope.place = place;
      }
    }

    $scope.submitForm = function() {
      if ($scope.place) {
        console.log('submitting form');
        $scope.PinService.add($scope.place);
        $scope.closeAddPanel();
      }
    }

    /**
     * Flag this location as no longer accepting donations. Once flagged, a moderator
     * will notified and the listing will be styled different in search results.
     */
    $scope.flag = function(pin) {
      $scope.PinService.flag(pin);
      // todo: moderator notifications
    }

    $scope.unflag = function(pin) {
      $scope.PinService.unflag(pin);
    }

    $scope.remove = function(pin) {
      $scope.pins.$remove(pin);
    }

    $scope.approve = function(pin) {
      $scope.PinService.approve(pin);
    }

    $scope.unapprove = function(pin) {
      $scope.PinService.unapprove(pin);
    }

    $scope.isApproved = function(pin) {
      return PinService.isApproved(pin);
    }

    // todo: this must take user into account
    $scope.favorite = function(pin) {
      $scope.PinService.favorite(pin);
    }

    // todo
    $scope.unfavorite = function(pin) {
      $scope.PinService.unfavorite(pin);
    }

    // todo
    $scope.isFavorited = function(pin) {
      return pin.favorite;
    }

    $scope.openAddPanel = function() {
      $scope.newPin = {};
      $scope.place = {};
      $scope.addPanelExpanded = true;
    }

    $scope.closeAddPanel = function() {
      $scope.newPin = {};
      $scope.place = {};
      $scope.addPanelExpanded = false;
    }

    $scope.formatDate = function(dateMillis) {
      var date = new Date(dateMillis);
      var options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      };
      return date.toLocaleTimeString("en-us", options);
    }
});
