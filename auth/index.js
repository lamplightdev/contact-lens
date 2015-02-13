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

function Google(req, res, next) {
  passport.use(new GoogleStrategy({
      clientID: process.env.CONTACTLENS_GOOGLE_ID,
      clientSecret: process.env.CONTACTLENS_GOOGLE_SECRET,
      callbackURL: req.protocol + "://" + req.get('host') + "/auth/google/callback",
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

  next();
}

module.exports.serialization = serialization;
module.exports.Google = Google;
