'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

angular.module('starter.controllers').controller('PinsController', function ($scope, Auth, PinService, UserService) {
  $scope.Auth = Auth;
  $scope.PinService = PinService;

  $scope.newPin = {};
  $scope.submittedPins = PinService.submittedPins;
  $scope.approvedPins = PinService.approvedPins;
  $scope.addPanelExpanded = false;

  // any time auth state changes, add the user data to scope
  $scope.Auth.$onAuthStateChanged(function (firebaseUser) {
    if (!firebaseUser) {
      $scope.admin = null;
    }
  });

  $scope.$on('$ionicView.enter', function () {
    // Create the autocomplete helper, and associate it with
    // an HTML text input box.
    var input = document.getElementById('placeQuery');
    $scope.autocomplete = new google.maps.places.Autocomplete(input);
    // Get the full place details when the user selects a place from the
    // list of suggestions.
    google.maps.event.addListener($scope.autocomplete, 'place_changed', $scope.onPlaceChanged);
  });

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
    // todo: moderator notifications
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

  // $scope.favorite = function(pin) {
  //   $scope.PinService.addToFavorites(pin, $scope.firebaseUser.uid);
  // }

  // $scope.unfavorite = function(pin) {
  //   $scope.PinService.removeFromFavorites(pin, $scope.firebaseUser.uid);
  // }

  // $scope.isFavorite = function(pin) {
  //   $scope.PinService.isFavorite(pin, $scope.firebaseUser.uid);
  // }

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
});