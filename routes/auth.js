module.exports = (function() {
    'use strict';
    var router = require('express').Router();
    var passport = require('passport');


    router.get('/signin/google/:state?', function(req, res, next) {
      passport.authenticate('google', {
            scope: [
                'https://www.googleapis.com/auth/contacts.readonly',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ],
            state: req.params.state,
            loginHint: req.user ? req.user.providerID : null
        })(req, res, next);
    });

    router.get('/google/callback', function(req, res, next) {
      passport.authenticate('google', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/account'); }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          switch(req.query.state) {
              case 'import':
                  return res.redirect('/account/importtest');
              default:
                  return res.redirect('/account');
          }
        });
      })(req, res, next);
    });


    router.get('/signout', function (req, res) {
        req.logOut();
        res.redirect('/account');
    });


    return router;
})();
