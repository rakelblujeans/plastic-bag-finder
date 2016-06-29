// let's create a re-usable factory that generates the $firebaseAuth instance
angular.module('starter.services')
  .factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
      return $firebaseAuth();
    }
  ]);
