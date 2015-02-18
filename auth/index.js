'use strict';

var passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,

    ModelUser = require('../lib/models/user'),
    ModelContact = require('../lib/models/contact'),
    request = require('then-request');


function serialization() {
  passport.serializeUser(function(user, done) {
    done(null, user.getID());
  });

  passport.deserializeUser(function(userID, done) {
    ModelUser.findByID(userID).then( (user) => {
      done(null, user);
    }, (error) => {
      done(error);
    });
  });
}

function Google() {
  passport.use(new GoogleStrategy({
      clientID: process.env.CONTACTLENS_GOOGLE_ID,
      clientSecret: process.env.CONTACTLENS_GOOGLE_SECRET,
      callbackURL: process.env.CONTACTLENS_HOST_PROTOCOL +
       "://" +
       process.env.CONTACTLENS_HOST_NAME +
       "/auth/google/callback",
    },
    function(accessToken, refreshToken, profile, done) {
      ModelUser.findByProvider(profile.provider, profile.id).then((user) => {
        if (user) {
          //TODO: update?? (yes)
          user = new ModelUser(user);
          user._members.token = accessToken;
          return user.sync().then(() => {
            return user;
          });
        } else {
          user = new ModelUser({
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: profile.provider,
            providerID: profile.id,
            token: accessToken
          });
          return user.save();
        }
      }).then((user) => {
        done(null, user);
      }, (err) => {
        console.log('google auth model error', err);
        done(err);
      });
    }
  ));
}

function importFromGoogle(user) {
  let url = 'https://www.google.com/m8/feeds/contacts/default/full';

  let params = {
    alt: 'json',
    'max-results': 1000,
    orderby: 'lastmodified',
    group: 'http://www.google.com/m8/feeds/groups/' + user.getEmail() + '/base/6', //'Contacts',
  };

  let headers = {
    'Authorization': 'Bearer ' + user.getToken(),
  };

  return request('GET', url, {
    qs: params,
    headers: headers,
  }).then( (response) => {
    let result = JSON.parse(response.body);
    let raw = [];
    result.feed.entry.forEach(function(contact) {
      let name = contact.title.$t;
      let email = contact.gd$email && contact.gd$email[0] ? contact.gd$email[0].address : null;
      let phone = contact.gd$phoneNumber && contact.gd$phoneNumber[0] ? contact.gd$phoneNumber[0].$t : null;

      if (name && (email || phone)) {
        raw.push({
          name: name,
          email: email,
          phone: phone,
          address: contact.gd$postalAddress && contact.gd$postalAddress[0] ? contact.gd$postalAddress[0].$t : null,
          provider: 'google',
          providerID: contact.id.$t,
        });
      }
    });

    return ModelContact.insert(raw);
  }).catch( (error) => {
    console.log(error);
  });
}

module.exports.serialization = serialization;
module.exports.Google = Google;
module.exports.importFromGoogle = importFromGoogle;
