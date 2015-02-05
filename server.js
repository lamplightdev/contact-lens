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
    Collection         = require('./lib/models/collection'),
    ControllerContacts = require('./lib/controllers/contacts'),

    port         = (process.env.PORT || 8000);


setupServer();


function setupServer (worker) {
    var app = express(),
        server = app.listen(port, function () {
            console.log("Bedrock App is now listening on port " + server.address().port);
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


    ///////////////////////////////////////////
    //              Routes                   //
    ///////////////////////////////////////////

    /////// ADD ALL YOUR ROUTES HERE  /////////

    router.delete('/api/contacts/:id', function (req, res) {
        var ctrlr = new ControllerContacts(null, {
            contacts: req.session.contacts,
            currentID: req.params.id
        });

        ctrlr.removeCurrent();

        res.statusCode = 204;
        res.end();
    });

    router.get('/contacts/:id?', function (req, res) {

        /*
        var ctrlr = new ControllerContacts(null, {
            contacts: req.session.contacts,
            currentID: req.params.id
        });
        */
        console.log(req.session.contacts);
        var ctrlr = new ControllerContacts(req.session.contacts);

        res.render("view-contacts", ctrlr._getViewData());
    });

    router.post('/contacts/:id?', function (req, res) {
        var ctrlr = new ControllerContacts(null, {
            contacts: req.session.contacts,
            currentID: req.body.id
        });

        ctrlr.removeCurrent();

        res.redirect('/contacts');

        //res.render("view-contacts", ctrlr.getViewData());
    });

    router.get('/account/', function (req, res) {
        res.render("view-account");
    });

    router.post('/api/add', function (req, res) {
        var contact = new Contact({
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
    app.use(function(req, res){
        res.render('404', { status: 404, url: req.url });
    });

    app.use(function(err, req, res){
        res.render('500', {
            status: err.status || 500,
            error: err
        });
    });

    return server;
}

