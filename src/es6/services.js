angular.module('starter.services', [])
.constant('googleMapsKey', 'AIzaSyAqdnKiE3Z48MosGNE015UlO4kjg23dKf4')

// let's create a re-usable factory that generates the $firebaseAuth instance
.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
])

.service('UserService', function(Auth, $firebaseArray) {

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
})

.factory('PinService', function($firebaseArray, UserService) {
  var submittedPinsRef = firebase.database().ref().child('pins/submitted');
  var approvedPinsRef = firebase.database().ref().child('pins/approved');
  // submittedPinsRef.keepSynced(true);
  // approvedPinsRef.keepSynced(true);
  var submittedPins = $firebaseArray(submittedPinsRef);
  var approvedPins = $firebaseArray(approvedPinsRef);

  var Status = {
    SUBMITTED: 'SUBMITTED',
    APPROVED: 'APPROVED',
    FLAGGED: 'FLAGGED'
  }

  // todo: limit by proximity to me
  // todo: pagination?

  var add = function(place) {
    // console.log('inside adding', place);
    // console.log('submittedPins', submittedPins);
    var newPin = {};
    _setData(newPin, place);
    if (newPin.address) {
      submittedPins.$add(newPin);
    }
  };

  var remove = function(pin) {
    if (pin.status === Status.APPROVED) {
      approvedPins.$remove(pin);
    } else if (pin.status === Status.SUBMITTED) {
      submittedPins.$remove(pin);
    }
  }

  /** In practice, we should never need this. The only updates
    * someone would make is to flag this place as no longer accepting donations,
    * otherwise they will leave comments. Anything else should be brought up to the
    * moderators attention.
    */
  var update = function(pin, place) {
    _setData(pin, place);
    _save(pin);
  }

  var approve = function(pin) {
    pin.status = Status.APPROVED;
    pin.updatedAt = Date.now();
    approvedPins.$add(pin);
    submittedPins.$remove(pin);
  };

  var unapprove = function(pin) {
    pin.status = Status.SUBMITTED;
    pin.updatedAt = Date.now();
    submittedPins.$add(pin);
    approvedPins.$remove(pin);
  };

  var isApproved = function(pin) {
    return pin.status === Status.APPROVED;
  };

  // TODO: notify admin of flags through notifications
  var flag = function(pin) {
    pin.flagged = true;
    _save(pin);
  }

  var unflag = function(pin) {
    pin.flagged = false;
    _save(pin);
  }

  var _setData = function(pin, place) {
    // console.log(pin, place);
    pin.placeId = place.place_id;
    pin.lat = place.geometry.location.lat();
    pin.lng = place.geometry.location.lng();
    pin.address = place.formatted_address;
    pin.short_address = place.formatted_address.substring(0, place.formatted_address.indexOf(','));
    pin.adr_address = place.adr_address;
    pin.vicinity = place.vicinity; // local area, like Brooklyn
    if (pin.name) {
      pin.name = place.name;
    }

    if (pin.phone) {
      pin.phone = place.formatted_phone_number;
    }

    if (place.opening_hours) {
      pin.opening_hours = place.opening_hours;
    }

    if (pin.url) {
      pin.url = place.url;
    }

    if (pin.icon) {
      pin.icon = place.icon;
    }

    pin.favorites = [];
    pin.status = 'submitted';
    pin.createdAt = Date.now();
    pin.updatedAt = Date.now();
  }

  var _save = function(pin) {
    pin.updatedAt = Date.now();
    if (pin.status === Status.APPROVED) {
      approvedPins.$save(pin);
    } else if (pin.status === Status.SUBMITTED) {
      submittedPins.$save(pin);
    }
  }

  var addToFavorites = function(pin, uid) {
    if (!pin.favorites) {
      pin.favorites = [];
    }

    var idx = pin.favorites.indexOf(uid);
    if (idx == -1) {
      pin.favorites.push(uid);
      _save(pin);
    }
  }

  var removeFromFavorites = function(pin, uid) {
    if (!pin || !pin.favorites) {
      return;
    }

    var idx = pin.favorites.indexOf(uid);
    if (idx > -1) {
      pin.favorites.splice(idx, 1);
      _save(pin);
    }
  }

  var isFavorite = function(pin, uid) {
    if (!pin || !pin.favorites) {
      return false;
    }

    return pin.favorites.indexOf(uid) > -1;
  }

  return {
    approvedPins: approvedPins,
    submittedPins: submittedPins,
    add: add,
    remove: remove,
    approve: approve,
    unapprove: unapprove,
    flag: flag,
    unflag: unflag,
    isApproved: isApproved,
    addToFavorites: addToFavorites,
    removeFromFavorites: removeFromFavorites,
    isFavorite: isFavorite
  };
});
