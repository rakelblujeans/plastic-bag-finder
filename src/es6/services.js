var firebaseBaseURL = 'https://plastic-bag-finder.firebaseio.com';

angular.module('starter.services', [])
.constant('googleMapsKey', 'AIzaSyAqdnKiE3Z48MosGNE015UlO4kjg23dKf4')

.factory('PinService', function($firebaseArray) {
  var pinsRef = new Firebase(firebaseBaseURL + '/pins');

  var Status = {
    SUBMITTED: 'SUBMITTED',
    APPROVED: 'APPROVED',
    FLAGGED: 'FLAGGED'
  }

  // todo: order by proximity to me
  // todo: pagination? limit # of results
  var pins = $firebaseArray(pinsRef);

  var add = function(place) {
    var newPin = {};
    _setData(newPin, place);
    if (newPin.address) {
      pins.$add(newPin);
    }
  };

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
    _save(pin);
  };

  var unapprove = function(pin) {
    pin.status = Status.SUBMITTED;
    _save(pin);
  };

  var isApproved = function(pin) {
    return pin.status === Status.APPROVED;
  };

  // todo
  var favorite = function(pin) {
    pin.favorite = true;
    _save(pin);
  }

  // todo
  var unfavorite = function(pin) {
    pin.favorite = false;
    _save(pin);
  }

  var flag = function(pin) {
    pin.flagged = true;
    _save(pin);
  }

  var unflag = function(pin) {
    pin.flagged = false;
    _save(pin);
  }

  var _setData = function(pin, place) {
    console.log(place);
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

    pin.status = 'submitted';
    pin.createdAt = Date.now();
    pin.updatedAt = Date.now();
  }

  var _save = function(pin) {
    pin.updatedAt = Date.now();
    pins.$save(pin);
  }

  return {
    pins: pins,
    add: add,
    // update: update,
    approve: approve,
    unapprove: unapprove,
    flag: flag,
    unflag: unflag,
    isApproved: isApproved,
    favorite: favorite,
    unfavorite: unfavorite,
  };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});


// .factory('Utils', function() {

//   function geocodeAddress(address, callbackFn) {
//     var geocoder = new google.maps.Geocoder();
//     geocoder.geocode({'address': '1303 Fulton St, Brooklyn, NY 11216'}, function(results, status) {
//       if (status == google.maps.GeocoderStatus.OK) {
//         if (results.length) {
//           callbackFn(results[0]);
//         } else {
//           // no results found
//           callbackFn(null);
//         }
//       } else {
//         // alert('Geocode was not successful for the following reason: ' + status);
//         callbackFn(null);
//       }
//     });
//   };

//   return {
//     geocodeAddress: geocodeAddress
//   };
// })
