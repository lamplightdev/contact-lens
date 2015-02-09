'use strict';

require("6to5/register");

//setup Dependencies
var express  = require('express'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    csrf         = require('csurf'),
    session      = require('express-session'),
    state        = require('express-state'),

    mongoose     = require('mongoose'),

    hbs          = require('./lib/exphbs'),
    middleware   = require('./middleware'),
    config       = require('./config'),

    ModelContact       = require('./lib/models/contact'),
    ControllerContacts = require('./lib/controllers/contacts'),

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


    // Specify the public directory.
    app.use(express.static(config.dirs.pub));

    app.use(csrf());
    app.use(function (req, res, next) {
        var token = req.csrfToken();
        res.cookie('XSRF-TOKEN', token);
        res.locals._csrf = token;

        next();
    });

    app.use(function (req, res, next) {
      ModelContact.load().then(function (collection) {
        req.session.contacts = collection;
        app.expose({
          contacts: collection.toJSON(),
          _csrf: res.locals._csrf
        }, 'Data');

        next();
      }, function (error) {
        console.log('init load error: ', error);
      });
      /*
      if (!contacts) {
        req.session.contacts = new Collection();
        req.session.count = 1;
      } else {
        req.session.contacts = new Collection(ModelContact.fromJSON(req.session.contacts));
      }
      */
    });


    app.use(middleware.exposeTemplates());

    // Use the router.
    app.use(router);


    ///////////////////////////////////////////
    //              Routes                   //
    ///////////////////////////////////////////

    /////// ADD ALL YOUR ROUTES HERE  /////////


    router.post('/api/contacts', function (req, res) {
        var ctrlr = new ControllerContacts(req.session.contacts, [], null, {
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
           req.session.contacts = ctrlr.getCollection();
           res.json(modelToAdd.toJSON());
        });
    });

    router.put('/api/contacts/:id', function (req, res) {
        var ctrlr = new ControllerContacts(req.session.contacts, [], null, {
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
            req.session.contacts = ctrlr.getCollection();
            res.json(modelToEdit.toJSON());
        });
    });

    router.delete('/api/contacts/:id', function (req, res) {
        var ctrlr = new ControllerContacts(req.session.contacts, [], null, {
            _csrf: res.locals._csrf
        });

        ctrlr.removeByID(req.params.id);

        res.statusCode = 204;
        req.session.contacts = ctrlr.getCollection();
        res.end();
    });

    router.get('/contacts/edit/:id', function (req, res, next) {
        var ctrlr = new ControllerContacts(req.session.contacts, [], null, {
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
        var ctrlr = new ControllerContacts(req.session.contacts, [], null, {
            _csrf: res.locals._csrf
        });

        var selected = ctrlr.select(req.params.id);
        if (req.params.id && !selected) {
            next();
        } else {
            res.render("view-contacts", ctrlr._getViewData());
        }
    });

    router.post('/contacts', function (req, res, next) {

        var ctrlr = new ControllerContacts(req.session.contacts, [], null, {
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
                    req.session.contacts = ctrlr.getCollection();
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
                    req.session.contacts = ctrlr.getCollection();
                    res.redirect('/contacts/' + modelToEdit.getID());
                }, function (err) {
                    console.log('update error', err);
                    next();
                });
            break;
            case 'remove':
                ctrlr.removeByID(req.body.id, 10);

                req.session.contacts = ctrlr.getCollection();
                res.redirect('/contacts/');
            break;
            default:
                next();
            break;
        }
    });

    router.get('/account', function (req, res) {
        res.render("view-account");
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

