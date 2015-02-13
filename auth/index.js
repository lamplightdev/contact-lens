'use strict';

var express = require('express'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


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
      clientID: process.env.CONTACTLENS_GOOGLE_ID, //privateData.google.id,
      clientSecret: process.env.CONTACTLENS_GOOGLE_SECRET, //privateData.google.secret,
      callbackURL: process.env.CONTACTLENS_HOST_PROTOCOL
       + "://"
       + process.env.CONTACTLENS_GOOGLE_HOST_NAME
       + "/auth/google/callback",
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
