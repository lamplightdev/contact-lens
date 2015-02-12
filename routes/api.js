module.exports = (function() {
    'use strict';
    var router = require('express').Router(),
        ModelContact       = require('../lib/models/contact'),
        ControllerContacts = require('../lib/controllers/contacts');

    router.post('/contacts', function (req, res) {
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
           res.statusCode = 201;
           res.json(modelToAdd.toJSON());
        });
    });

    router.put('/contacts/:id', function (req, res) {
        var ctrlr = new ControllerContacts(res.locals.contacts, [], null, {
            _csrf: res.locals._csrf
        });

        var modelToEdit = new ModelContact({
            _id: req.params.id,
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
        });
        modelToEdit.sync().then(function () {
            ctrlr.update(modelToEdit);

            res.statusCode = 200;
            res.json(modelToEdit.toJSON());
        });
    });

    router.delete('/contacts/:id', function (req, res) {
        var ctrlr = new ControllerContacts(res.locals.contacts, [], null, {
            _csrf: res.locals._csrf
        });

        new ModelContact().deleteByID(req.params.id).then(function () {
            ctrlr.removeByID(req.params.id);

            res.statusCode = 204;
            res.end();
        }).catch(function(err) {
            console.log('remove error', err);
        });
    });

    router.get('/contacts/search', function (req, res) {
        var ctrlr = new ControllerContacts(res.locals.contacts, [], null, {
            _csrf: res.locals._csrf
        });

        if (req.query.q) {
            ctrlr.search(req.query.q).then(function(founds) {
                res.statusCode = 200;
                res.json(founds.toJSON());
            });
        } else {
            res.statusCode = 200;
            res.json([]);
        }
    });

    return router;
})();
