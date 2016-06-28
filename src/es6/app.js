// Ionic Starter App
angular.module('starter', [
  'ionic', 'firebase', 'ngCordova',
  'starter.controllers', 'starter.services'
])

// .config(function($compileProvider){
//   $compileProvider.aHrefSanitizationWhitelist(/^\s*(geo):/);
// })
.config(function($ionicConfigProvider) {
  $ionicConfigProvider.navBar.alignTitle('center');
})

.run(function($ionicPlatform, $rootScope, $state) {
  $rootScope.$on("$stateChangeError",
      function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $state.go("/tab/account");
    }
  });

  $ionicPlatform.ready(function() {
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

    Firebase.getDefaultConfig().setPersistenceEnabled(true);
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
    // resolve: {
    //   // controller will not be loaded until $waitForSignIn resolves
    //   "currentAuth": ["Auth", function(Auth) {
    //     // $waitForSignIn returns a promise so the resolve waits for it to complete
    //     return Auth.$waitForSignIn();
    //   }]
    // }
  })

  // Each tab has its own nav history stack:

  .state('tab.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapController',
      },
    }
    // resolve: {
    //   "currentAuth": ["Auth", function(Auth) {
    //     return Auth.$waitForSignIn();
    //   }]
    // }
  })

  .state('tab.map-pin-detail', {
    url: '/mapPins/:pinId',
    views: {
      'tab-map': {
        templateUrl: 'templates/pin-detail.html',
        controller: 'PinDetailController',
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountController',
      }
    }
    // resolve: {
    //   "currentAuth": ["Auth", function(Auth) {
    //     return Auth.$waitForSignIn();
    //   }]
    // }
  })

  .state('tab.pins', {
    url: '/pins',
    views: {
      'tab-pins': {
        templateUrl: 'templates/tab-pins.html',
        controller: 'PinsController',
      }
    }
    // resolve: {
    //   "currentAuth": ["Auth", function(Auth) {
    //     return Auth.$waitForSignIn();
    //   }]
    // }
  })

  .state('tab.pin-detail', {
    url: '/pins/:pinId',
    views: {
      'tab-pins': {
        templateUrl: 'templates/pin-detail.html',
        controller: 'PinDetailController',
      }
    }
    // resolve: {
    //   "currentAuth": ["Auth", function(Auth) {
    //     return Auth.$waitForSignIn();
    //   }]
    // }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/map');
});
