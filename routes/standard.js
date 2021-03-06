
module.exports = (function() {
    'use strict';
    var router = require('express').Router(),
        ModelContact       = require('../lib/models/contact'),
        ControllerContacts = require('../lib/controllers/contacts'),
        RouterSharedContacts = require('../lib/routers/shared-contacts'),
        RouterSharedAccount = require('../lib/routers/shared-account'),
        importFromGoogle = require('../auth').importFromGoogle,
        getPhotosFromGoogle = require('../auth').getPhotosFromGoogle;


    router.get('/avatar/:id', (req, res, next) => {
        ModelContact.findByID(req.params.id).then((contact) => {
            let avatar = contact.getAvatar();
            if (avatar) {
                res.writeHead(200, {'Content-Type': avatar.contentType});
                res.end(avatar.data.toString('binary'), 'binary');
            }
        }).then(null, next);
    });


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

    router.post('/contacts/bulkedit', function (req, res, next) {
        var ctrlr = new ControllerContacts(res.locals.contacts, [], null, {
            _csrf: res.locals._csrf
        });

        if (req.body.delete === '') {
            for (let id in req.body) {
                if (id !== 'delete') {
                    ModelContact.deleteByID(id).then(() => {
                        ctrlr.removeByID(id);
                    }, (err) => {
                        console.log('remove error', err);
                        next();
                    });
                }
            }
            res.redirect('/contacts');
        } else {
            next();
        }
    });

    router.post('/contacts/remove', function (req, res, next) {
        var ctrlr = new ControllerContacts(res.locals.contacts, [], null, {
            _csrf: res.locals._csrf
        });

        ModelContact.deleteByID(req.body.id).then(() => {
            ctrlr.removeByID(req.body.id);

            res.redirect('/contacts/');
        }, function(err) {
            console.log('remove error', err);
            next();
        });
    });

    // -- //

    router.get(/account\/importgo\/?/i, (req, res, next) => {
        importFromGoogle(req.user).then(() => {
          res.redirect('/account');
        }, next);
    });

    router.get(/account\/getphotos\/?/i, (req, res, next) => {
        ModelContact.load().then((collection) => {
            let batch = [];
            collection._models.forEach((model) => {
                if (model._members.providerPhoto !== 'false') {
                    batch.push({
                        id: model.getID(),
                        link: model._members.providerPhoto,
                    });
                }
            });

            getPhotosFromGoogle(req.user, batch);
        }).then(() => {
            res.redirect('/contacts');
        });
    });
    // catch all for /account/...
    router.get(/account(?:$|\/(.*))/i, (req, res, next) => {
        var sharedRouter = new RouterSharedAccount({
            user: req.user
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
