module.exports = (function() {
    'use strict';
    var router = require('express').Router(),
        ModelContact       = require('../lib/models/contact'),
        ControllerContacts = require('../lib/controllers/contacts'),
        ControllerAccount = require('../lib/controllers/account'),
        RouterContacts = require('../lib/routers/contacts'),
        request = require('request');

    router.get(/contacts(?:$|\/(.*))/i, (req, res, next) => {
        new RouterContacts().match(req.params[0], {
            contacts: res.locals.contacts,
            _csrf: res.locals._csrf,
            query: req.query,
        }, (ctrlr) => {
            res.render("view-contacts", ctrlr._getViewData());
        }, (err) => {
            console.log('contacts route error: ', err);
            next();
        });
    });

    router.post('/contacts/add', function (req, res) {
        var ctrlr = new ControllerContacts(res.locals.contacts, [], null, {
            _csrf: res.locals._csrf
        });

        var modelToAdd = new ModelContact({
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
        });
        modelToAdd.sync().then(function () {
            ctrlr.add(modelToAdd);
            res.redirect('/contacts/' + modelToAdd.getID());
        });
    });

    router.post('/contacts/edit', function (req, res, next) {
        var ctrlr = new ControllerContacts(res.locals.contacts, [], null, {
            _csrf: res.locals._csrf
        });

        var modelToEdit = new ModelContact({
            _id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
        });
        modelToEdit.sync().then(function () {
            ctrlr.update(modelToEdit);
            res.redirect('/contacts/' + modelToEdit.getID());
        }, function (err) {
            console.log('update error', err);
            next();
        });
    });

    router.post('/contacts/remove', function (req, res, next) {
        var ctrlr = new ControllerContacts(res.locals.contacts, [], null, {
            _csrf: res.locals._csrf
        });

        new ModelContact().deleteByID(req.body.id).then(function () {
            ctrlr.removeByID(req.body.id);

            res.redirect('/contacts/');
        }).catch(function(err) {
            console.log('remove error', err);
            next();
        });
    });

    router.get('/account', function (req, res) {
        var ctrlr = new ControllerAccount(res.locals.contacts, [], null, {
            user: req.user
        });

        res.render("view-account", ctrlr._getViewData());
    });

    router.get('/account/import', function (req, res) {
        var ctrlr = new ControllerAccount(res.locals.contacts, [], null, {
            user: req.user
        });

        if (req.user) {
            var url = 'https://www.google.com/m8/feeds/contacts/default/full';

            var params = {
                alt: 'json',
                'max-results': 1000,
                orderby: 'lastmodified',
            };

            var headers = {
                'Authorization': 'Bearer ' + req.user.accessToken,
            };

            request.get({
                url: url,
                qs: params,
                headers: headers,
                json: true,
            }, function (e, r, result) {
                var raw = [];
                result.feed.entry.forEach(function(contact) {
                    if (contact.title.$t) {
                        raw.push({
                            name: contact.title.$t,
                            email: contact.gd$email && contact.gd$email[0] ? contact.gd$email[0].address : null,
                            phone: contact.gd$phoneNumber && contact.gd$phoneNumber[0] ? contact.gd$phoneNumber[0].$t : null,
                            address: contact.gd$postalAddress && contact.gd$postalAddress[0] ? contact.gd$postalAddress[0].$t : null,
                        });
                    }
                });
                ModelContact.insert(raw).then(function(models) {
                    ctrlr.add(models);
                    res.expose(ctrlr.getCollection().toJSON(), 'Data.contacts');
                    res.render("view-account", ctrlr._getViewData());
                }, function(error) {
                    console.log('insert error', error);
                });
            });
        } else {
            res.render("view-account", ctrlr._getViewData());
        }

    });

    return router;
})();
