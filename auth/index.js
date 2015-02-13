'use strict';

var passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,

    ModelUser = require('../lib/models/user');


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
      clientID: process.env.CONTACTLENS_GOOGLE_ID,
      clientSecret: process.env.CONTACTLENS_GOOGLE_SECRET,
      callbackURL: process.env.CONTACTLENS_HOST_PROTOCOL +
       "://" +
       process.env.CONTACTLENS_HOST_NAME +
       "/auth/google/callback",
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(arguments);
      ModelUser.findByProvider(profile.provider, profile.id).then((user) => {
        if (user) {
          return user;
        } else {
          user = new ModelUser({
            name: profile.displayName,
            email: '',
            provider: profile.provider,
            providerID: profile.id,
            token: accessToken,
            refreshToken: refreshToken,
          });
          return user.save();
        }
      }).then((user) => {
        done(null, user.toJSON());
      }, (err) => {
        console.log('google auth model error', err);
      });
    }
  ));
}

module.exports.serialization = serialization;
module.exports.Google = Google;
