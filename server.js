'use strict';

require("6to5/register");

//setup Dependencies
var express  = require('express'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    csrf         = require('csurf'),
    session      = require('express-session'),
    state        = require('express-state'),
    request      = require('request'),

    mongoose     = require('mongoose'),

    hbs          = require('./lib/exphbs'),
    middleware   = require('./middleware'),
    config       = require('./config'),
    privateData  = require('./config/private'),

    passport     = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,

    ModelContact       = require('./lib/models/contact'),
    ControllerContacts = require('./lib/controllers/contacts'),
    ControllerAccount = require('./lib/controllers/account'),

    port         = (process.env.PORT || 8000);


mongoose.connect('mongodb://localhost/contact-lens');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', setupServer);


function setupServer () {
    var app = express(),
        server = app.listen(port, function () {
            console.log("Contact Lens is now listening on port " + server.address().port);
        }),
        router;

    //Setup Express App
    state.extend(app);
    app.engine(hbs.extname, hbs.engine);
    app.set('view engine', hbs.extname);
    app.enable('view cache');

    //Uncomment this if you want strict routing (ie: /foo will not resolve to /foo/)
    //app.enable('strict routing');

    //Change "App" to whatever your application's name is, or leave it like this.
    app.set('state namespace', 'App');

    if (app.get('env') === 'development') {
      app.use(middleware.logger('tiny'));
    }

    // Set default views directory.
    app.set('views', config.dirs.views);

    // Specify the public directory.
    app.use(express.static(config.dirs.pub));

    router = express.Router({
        caseSensitive: app.get('case sensitive routing'),
        strict       : app.get('strict routing')
    });

    // Parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));

    // Parse application/json
    app.use(bodyParser.json());

    // Parse cookies.
    app.use(cookieParser());

    // Session Handling
    app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: false}));

    // Passport authentication
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new TwitterStrategy({
        consumerKey: privateData.twitter.key,
        consumerSecret: privateData.twitter.secret,
        callbackURL: "http://localhost:8000/auth/twitter/callback"
      },
      function(token, tokenSecret, profile, done) {
        done(null, {
            _id: 1,
            token: token,
            tokenSecret: tokenSecret,
            provider: profile.provider,
            providerID: profile.id,
            name: profile.displayName,
            username: profile.username
        });
      }
    ));
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
      done(null, user);
    });

    app.use(csrf());
    app.use(function (req, res, next) {
        var token = req.csrfToken();
        res.cookie('XSRF-TOKEN', token);
        res.locals._csrf = token;
        app.expose(token, 'Data._csrf');
        app.expose(req.user, 'Data.user');
        next();
    });


    app.use(middleware.exposeTemplates());
    app.use(middleware.exposeContacts());

    // Use the router.
    app.use(router);


    ///////////////////////////////////////////
    //              Routes                   //
    ///////////////////////////////////////////

    /////// ADD ALL YOUR ROUTES HERE  /////////

    router.get('/auth/twitter', passport.authenticate('twitter'));

    router.get('/auth/twitter/callback',
      passport.authenticate('twitter', { successRedirect: '/contacts',
                                         failureRedirect: '/account' }));


    router.post('/api/contacts', function (req, res) {
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

    router.put('/api/contacts/:id', function (req, res) {
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

    router.delete('/api/contacts/:id', function (req, res) {
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

    router.get('/api/contacts/search', function (req, res) {
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

    router.get('/contacts/add', function (req, res) {
        var ctrlr = new ControllerContacts(res.locals.contacts, [], null, {
            _csrf: res.locals._csrf
        });

        ctrlr.addContact(true);

        res.render("view-contacts", ctrlr._getViewData());
    });

    router.get('/contacts/edit/:id', function (req, res, next) {
        var ctrlr = new ControllerContacts(res.locals.contacts, [], null, {
            _csrf: res.locals._csrf
        });

        var edited = ctrlr.edit(req.params.id);
        if (req.params.id && !edited) {
            next();
        } else {
            res.render("view-contacts", ctrlr._getViewData());
        }
    });

    router.get('/contacts/:id?', function (req, res, next) {
        var ctrlr = new ControllerContacts(res.locals.contacts, [], null, {
            _csrf: res.locals._csrf
        });
        var selected = ctrlr.select(req.params.id);
        if (req.params.id && !selected) {
            next();
        } else {
            res.render("view-contacts", ctrlr._getViewData());
        }
    });

    router.get('/contacts/search', function (req, res) {
        var ctrlr = new ControllerContacts(res.locals.contacts, [], null, {
            _csrf: res.locals._csrf
        });

        if (req.query.q) {
            ctrlr.search(req.query.q);
        }

        res.render("view-contacts", ctrlr._getViewData());

    });

    router.post('/contacts', function (req, res, next) {

        var ctrlr = new ControllerContacts(res.locals.contacts, [], null, {
            _csrf: res.locals._csrf
        });

        switch (req.body.type) {
            case 'add':
                var modelToAdd = new ModelContact({
                    name: req.body.name,
                    email: req.body.email,
                    address: req.body.address,
                });
                modelToAdd.sync().then(function () {
                    ctrlr.add(modelToAdd);
                    res.redirect('/contacts/' + modelToAdd.getID());
                });

            break;
            case 'edit':
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
            break;
            case 'remove':
                new ModelContact().deleteByID(req.body.id).then(function () {
                    ctrlr.removeByID(req.body.id);

                    res.redirect('/contacts/');
                }).catch(function(err) {
                    console.log('remove error', err);
                    next();
                });
            break;
            default:
                next();
            break;
        }
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
            var oauth = {
                consumer_key    : privateData.twitter.key,
                consumer_secret : privateData.twitter.secret,
                token           : req.user.token,
                token_secret    : req.user.tokenSecret
            };

            var url = 'https://api.twitter.com/1.1/friends/list.json';

            var params = {
                user_id: req.user.providerID
            };

            request.get({
                url: url,
                qs: params,
                oauth: oauth,
                json: true
            }, function (e, r, result) {
                var raw = [];
                result.users.forEach(function(user) {
                    raw.push({
                        name: user.name,
                        address: user.location
                    });
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

    // Error handling middleware
    app.use(function (req, res) {
        res.status(404);

        app.expose(true, 'Data.status404');


        if (req.accepts('html')) {
            res.render('404', { url: req.url });
        } else if (req.accepts('json')) {
            res.send({ error: 'Not found' });
        } else {
          res.type('txt').send('Not found');
        }
    });

    return server;
}

