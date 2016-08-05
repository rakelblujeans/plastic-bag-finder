angular.module('starter.services')
  .service('UserService', ['Auth', '$firebaseArray', '$cordovaOauth', 'googleAuthKey',
      function(Auth, $firebaseArray, $cordovaOauth, googleAuthKey) {

    var firebaseDBRef = firebase.database().ref();

    /*
     * NOTE: Redirect/popup auth for Ionic platforms is broken with Firebase 3. Until
     * this is fixed, I need to either switch to handling auth manually or possibly revert
     * to Firebase 2 for auth.
     *
     * See for more details: https://github.com/angular/angularfire2/issues/243
     */

    var login = function() {
      if(ionic.Platform.isWebView()) {
        $cordovaOauth.google(
          googleAuthKey, ["email"])
        .then(function(response) {
          var jsonResponse = JSON.stringify(response);
          // console.log("Response Object -> " + jsonResponse);
          if (jsonResponse) {
            _firebaseSigninWithCredential(response);
          }
        }, function(error) {
          console.log("Error -> " + error);
        });
      } else {
        _firebaseSigninWithRedirect();
      }
    }

    var _firebaseSigninWithCredential = function(token) {
      var credential = firebase.auth.GoogleAuthProvider.credential(token.id_token, token.access_token);

      Auth.$signInWithCredential(credential).then(function(firebaseUser) {
        if (firebaseUser) {
          // console.log("Signed in as:", firebaseUser);
          // TODO: for now, save everyone as admin. remove this later
          firebase.database().ref('/userRoles/' + firebaseUser.uid).set({
            role: 'admin'
          });
        }
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    }

    var _firebaseSigninWithRedirect = function() {
      Auth.$signInWithRedirect("google").then(function(firebaseUser) {
        if (firebaseUser) {
          // console.log("Signed in as:", firebaseUser.user);
          // TODO: for now, save everyone as admin. remove this later
          firebase.database().ref('/userRoles/' + firebaseUser.user.uid).set({
            role: 'admin'
          });
        }
      }).catch(function(error) {
        console.log("Authentication failed:", error);
      });
    }

    var logout = function() {
      Auth.$signOut();
    }

    var closeAccount = function() {
      // Delete the currently signed-in user
      Auth.$deleteUser().then(function() {
        // console.log("User deleted successfully");
      }).catch(function(error) {
        // console.log("Error deleting user:", error);
      });
    }

    var isAdmin = function() {
      var userId = firebase.auth().currentUser.uid;
      firebase.database().ref('/userRoles/' + userId).once('value').then(function(snapshot) {
        var role = snapshot.val().role;
        return role === 'admin';
      });
    }

    return {
      login: login,
      logout: logout,
      closeAccount: closeAccount,
      isAdmin: isAdmin
    };
  }]);
