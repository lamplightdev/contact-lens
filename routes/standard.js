module.exports = (function() {
    'use strict';
    var router = require('express').Router(),
        ModelContact       = require('../lib/models/contact'),
        ModelUser       = require('../lib/models/user'),
        ControllerContacts = require('../lib/controllers/contacts'),
        ControllerAccount = require('../lib/controllers/account'),
        RouterSharedContacts = require('../lib/routers/shared-contacts'),
        RouterSharedAccount = require('../lib/routers/shared-account');



    // catch all for /contacts/...
    router.get(/contacts(?:$|\/(.*))/i, (req, res, next) => {
        var sharedRouter = new RouterSharedContacts({
            contacts: res.locals.contacts,
            _csrf: res.locals._csrf,
        });

        sharedRouter.match(req.params[0], req.query, (routeParts, query) => {
            res.render("view-contacts", sharedRouter.getController()._getViewData());
        }, (err) => {
            console.log('contacts route error: ', err);
            next();
        });
    });


    // forms that post/put/delete //

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

        console.log(req.body);
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

        new ModelContact().deleteByID(req.body.id).then(() => {
            ctrlr.removeByID(req.body.id);

            res.redirect('/contacts/');
        }).catch(function(err) {
            console.log('remove error', err);
            next();
        });
    });

    // -- //


    // catch all for /account/...
    router.get(/account(?:$|\/(.*))/i, (req, res, next) => {
        var sharedRouter = new RouterSharedAccount({
            user: new ModelUser(req.user)
        });

        sharedRouter.match(req.params[0], req.query, (routeParts, query) => {

            if (routeParts[0] === 'import') {
                res.redirect('/auth/signin/google/import');
            } else {
                res.render("view-account", sharedRouter.getController()._getViewData());
            }
        }, (err) => {
            console.log('account route error: ', err);
            next();
        });
    });


    return router;
})();
