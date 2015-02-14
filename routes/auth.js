module.exports = (function() {
    'use strict';
    var router = require('express').Router();
    var passport = require('passport');

    router.get('/google', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/contacts.readonly',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ]
    }));

    router.get('/google/callback',
        passport.authenticate('google', {
            successRedirect: '/contacts',
            failureRedirect: '/account',
        })
    );

    router.get('/signout', function (req, res) {
        req.logout();
        res.redirect('/account');
    });


    return router;
})();
