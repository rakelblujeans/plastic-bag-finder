'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

angular.module('starter.controllers').controller('PinsController', ['$scope', '$ionicHistory', 'Auth', 'GoogleMapsLoader', 'PinService', 'UserService', function ($scope, $ionicHistory, Auth, PinService, UserService) {
  $scope.Auth = Auth;
  $scope.GoogleMapsLoader = GoogleMapsLoader;
  $scope.PinService = PinService;

  $scope.newPin = {};
  $scope.addPanelExpanded = false;

  // any time auth state changes, add the user data to scope
  // $scope.Auth.$onAuthStateChanged(function(firebaseUser) {
  //   $scope.user = firebaseUser;
  //   if (!firebaseUser) {
  //     $scope.admin = null;
  //   }
  // });

  $scope.$on('$ionicView.enter', function () {
    $ionicHistory.clearHistory();
    $scope.GoogleMapsLoader.init($scope.initialize);
  });

  $scope.initialize = function () {
    $scope.GoogleMapsLoader.enableInteraction();

    PinService.submittedPins.$loaded().then(function (submittedData) {
      $scope.submittedPins = submittedData;
      PinService.approvedPins.$loaded().then(function (approvedData) {
        $scope.approvedPins = approvedData;
      });
    });

    // Create the autocomplete helper, and associate it with
    // an HTML text input box.
    var input = document.getElementById('placeQuery');
    $scope.autocomplete = new window.google.maps.places.Autocomplete(input);
    // Get the full place details when the user selects a place from the
    // list of suggestions.
    google.maps.event.addListener($scope.autocomplete, 'place_changed', $scope.onPlaceChanged);
  };

  $scope.onPlaceChanged = function () {
    var place = $scope.autocomplete.getPlace();
    if (place.geometry) {
      $scope.place = place;
      // console.log('onPlaceChanged', $scope.place);
    }
  };

  // because the submit button is right underneath the address autocomplete dropdown,
  // it gets accidentally clicked very easily. We should not actually submit the form
  // unless we've explicitly clicked the button and have valid data
  $scope.submitForm = function () {
    if ($scope.place.adr_address) {
      $scope.PinService.add($scope.place);
      $scope.closeAddPanel();
    }
  };

  $scope.isAdmin = function () {
    if (_typeof($scope.admin) === undefined) {
      $scope.admin = UserService.isAdmin();
    }
    return $scope.admin;
  };

  /**
   * Flag this location as no longer accepting donations. Once flagged, a moderator
   * will notified and the listing will be styled different in search results.
   */
  $scope.flag = function (pin) {
    $scope.PinService.flag(pin);
    // todo: moderator notifications, allow people to leave a
    // comment on why they're flagging
  };

  $scope.unflag = function (pin) {
    $scope.PinService.unflag(pin);
  };

  $scope.remove = function (pin) {
    $scope.PinService.remove(pin);
  };

  $scope.approve = function (pin) {
    $scope.PinService.approve(pin);
  };

  $scope.unapprove = function (pin) {
    $scope.PinService.unapprove(pin);
  };

  $scope.isApproved = function (pin) {
    return PinService.isApproved(pin);
  };

  $scope.favorite = function (pin) {
    if ($scope.user) {
      $scope.PinService.addToFavorites(pin, $scope.user.uid);
    }
  };

  $scope.unfavorite = function (pin) {
    if ($scope.user) {
      $scope.PinService.removeFromFavorites(pin, $scope.user.uid);
    }
  };

  $scope.isFavorite = function (pin) {
    if ($scope.user) {
      return $scope.PinService.isFavorite(pin, $scope.user.uid);
    }
  };

  $scope.openAddPanel = function () {
    $scope.newPin = {};
    $scope.place = {};
    $scope.addPanelExpanded = true;
  };

  $scope.closeAddPanel = function () {
    $scope.addPanelExpanded = false;
  };

  $scope.formatDate = function (dateMillis) {
    var date = new Date(dateMillis);
    var options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return date.toLocaleTimeString("en-us", options);
  };
}]);