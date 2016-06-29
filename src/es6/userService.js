angular.module('starter.services')
  .service('UserService', ['Auth', '$firebaseArray',
      function(Auth, $firebaseArray) {

    var firebaseDBRef = firebase.database().ref();
    // firebaseDBRef.keepSynced(true);

    var login = function() {
      Auth.$signInWithPopup("google").then(function(firebaseUser) {
        console.log("Signed in as:", firebaseUser.user);
        // TODO: for now, save everyone as admin. remove this later
        firebase.database().ref('/userRoles/' + firebaseUser.user.uid).set({
          role: 'admin'
        });
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
