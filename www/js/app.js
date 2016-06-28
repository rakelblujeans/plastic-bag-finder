'use strict';

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase', 'ngCordova', 'starter.controllers', 'starter.services'])

// .config(function($compileProvider){
//   $compileProvider.aHrefSanitizationWhitelist(/^\s*(geo):/);
// })
.config(function ($ionicConfigProvider) {
  $ionicConfigProvider.navBar.alignTitle('center');
}).run(function ($ionicPlatform, $rootScope, $state) {
  $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $state.go("/tab/account");
    }
  });

  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}).config(function ($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // .state('splash', {
  //   url: '/splash',
  //   templateUrl: 'templates/splash.html',
  //   controller: 'SplashController',
  //   resolve: {
  //     // controller will not be loaded until $waitForSignIn resolves
  //     // Auth refers to our $firebaseAuth wrapper in the example above
  //     "currentAuth": ["Auth", function(Auth) {
  //       // $waitForSignIn returns a promise so the resolve waits for it to complete
  //       return Auth.$waitForSignIn();
  //     }]
  //   }
  // })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    resolve: {
      // controller will not be loaded until $waitForSignIn resolves
      "currentAuth": ["Auth", function (Auth) {
        // $waitForSignIn returns a promise so the resolve waits for it to complete
        return Auth.$waitForSignIn();
      }]
    }
  })

  // Each tab has its own nav history stack:

  .state('tab.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapController'
      }
    },
    resolve: {
      // controller will not be loaded until $waitForSignIn resolves
      "currentAuth": ["Auth", function (Auth) {
        // $waitForSignIn returns a promise so the resolve waits for it to complete
        return Auth.$waitForSignIn();
      }]
    }
  }).state('tab.pins', {
    url: '/pins',
    views: {
      'tab-pins': {
        templateUrl: 'templates/tab-pins.html',
        controller: 'PinsController'
      }
    },
    resolve: {
      // controller will not be loaded until $waitForSignIn resolves
      "currentAuth": ["Auth", function (Auth) {
        // $waitForSignIn returns a promise so the resolve waits for it to complete
        return Auth.$waitForSignIn();
      }]
    }
  }).state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountController'
      }
    },
    resolve: {
      // controller will not be loaded until $waitForSignIn resolves
      "currentAuth": ["Auth", function (Auth) {
        // $waitForSignIn returns a promise so the resolve waits for it to complete
        return Auth.$waitForSignIn();
      }]
    }
  }).state('tab.pin-detail', {
    url: '/pins/:pinId',
    views: {
      'tab-pins': {
        templateUrl: 'templates/pin-detail.html',
        controller: 'PinDetailController'
      }
    },
    resolve: {
      // controller will not be loaded until $waitForSignIn resolves
      "currentAuth": ["Auth", function (Auth) {
        // $waitForSignIn returns a promise so the resolve waits for it to complete
        return Auth.$waitForSignIn();
      }]
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/map');
});