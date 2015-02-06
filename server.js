'use strict';

require("6to5/register");

//setup Dependencies
var express  = require('express'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    csrf         = require('csurf'),
    session      = require('express-session'),
    state        = require('express-state'),

    hbs          = require('./lib/exphbs'),
    middleware   = require('./middleware'),
    config       = require('./config'),

    ModelContact       = require('./lib/models/contact'),
    ControllerContacts = require('./lib/controllers/contacts'),

    port         = (process.env.PORT || 8000);


setupServer();


function setupServer (worker) {
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
      var contacts = req.session.contacts;
      if (!contacts) {
        req.session.contacts = [];
      }

      app.expose({
        contacts: req.session.contacts,
        _csrf: res.locals._csrf
      }, 'Data');

      next();
    });


    app.use(middleware.exposeTemplates());

    // Use the router.
    app.use(router);

    function addModel(req, name) {
        var obj = {
            id: req.session.contacts.length + 1,
            name: name
        };

        req.session.contacts.push(obj);

        return new ModelContact(obj);
    }


    function removeModel(req, id) {
        req.session.contacts.splice(id-1, 1);
    }

    ///////////////////////////////////////////
    //              Routes                   //
    ///////////////////////////////////////////

    /////// ADD ALL YOUR ROUTES HERE  /////////

    router.delete('/api/contacts/:id', function (req, res) {
        var ctrlr = new ControllerContacts(ModelContact.fromJSON(req.session.contacts), [], null, {
            _csrf: res.locals._csrf
        });

        removeModel(req, req.params.id);
        ctrlr.removeByID(req.params.id);

        res.statusCode = 204;
        res.end();
    });

    router.post('/api/contacts', function (req, res) {
        var ctrlr = new ControllerContacts(ModelContact.fromJSON(req.session.contacts), [], null, {
            _csrf: res.locals._csrf
        });

        var newModel = addModel(req, req.body.name);
        ctrlr.add(newModel);

        res.statusCode = 201;
        res.json(newModel.toJSON());
    });

    router.get('/contacts/:id?', function (req, res, next) {

        var ctrlr = new ControllerContacts(ModelContact.fromJSON(req.session.contacts), [], null, {
            _csrf: res.locals._csrf
        });

        var selected = ctrlr.select(req.params.id);
        if (req.params.id && !selected) {
            next();
        } else {
            res.render("view-contacts", ctrlr._getViewData());
        }
    });

    router.post('/contacts/:id?', function (req, res) {

        var ctrlr = new ControllerContacts(ModelContact.fromJSON(req.session.contacts), [], null, {
            _csrf: res.locals._csrf
        });

        switch (req.body.type) {
            case 'add':
                var newModel = addModel(req, req.body.name);
                ctrlr.add(newModel);
                res.redirect('/contacts/' + newModel.getID());

            break;
            case 'remove':
                removeModel(req, req.body.id);
                ctrlr.removeByID(req.body.id);

                res.redirect('/contacts/');
            break;
        }
    });

    router.get('/account/', function (req, res) {
        res.render("view-account");
    });

    router.post('/api/add', function (req, res) {
        var contact = new ModelContact({
            id: req.session.contactCount,
            name: req.body.name
        });

        req.session.contacts.push({
            id: contact.getID(),
            name: contact.getName()
        });
        req.session.contactCount++;

        if (!req.xhr) {
            res.redirect('/contacts');
        } else {
            res.statusCode = 201;
            res.json({
                id: contact.getID(),
                name: contact.getName()
            });
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

