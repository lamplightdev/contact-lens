'use strict';

var passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    privateData  = require('../config/private');


function serialization() {
  passport.serializeUser(function(user, done) {
      done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
}

function Google() {
  passport.use(new GoogleStrategy({
      clientID: privateData.google.id,
      clientSecret: privateData.google.secret,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    function(accessToken, refreshToken, profile, done) {
      done(null, {
          _id: 1,
          accessToken: accessToken,
          refreshToken: refreshToken,
          provider: profile.provider,
          providerID: profile.id,
          name: profile.displayName,
          username: profile.username
      });
    }
  ));
}

module.exports.serialization = serialization;
module.exports.Google = Google;
