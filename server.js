'use strict';

//setup Dependencies
var express  = require('express'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    csrf         = require('csurf'),
    session      = require('express-session'),
    state        = require('express-state'),
    flash        = require('express-flash'),

    hbs          = require('./lib/exphbs'),
    middleware   = require('./middleware'),
    config       = require('./config'),

    User         = require('./lib/user'),

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


    // Flash Message Support
    app.use(flash());

    // Specify the public directory.
    app.use(express.static(config.dirs.pub));

    // Uncomment this line if you are using Bower, and have a bower_components directory.
    // Before uncommenting this line, go into config/index.js and add config.dirs.bower there.
    //app.use(express.static(config.dirs.bower));

    app.use(csrf());
    app.use(function(req, res, next) {
        var token = req.csrfToken();
        res.cookie('XSRF-TOKEN', token);
        res.locals._csrf = token;
        next();
    });

    app.use(function (req, res, next) {
      var contacts = req.session.contacts;
      if (!contacts) {
        req.session.contactCount = 0;
        req.session.contacts = [];
      }

      app.expose({
        contacts: req.session.contacts
      }, 'Data');

      next();
    });

    // Use the router.
    app.use(router);


    ///////////////////////////////////////////
    //              Routes                   //
    ///////////////////////////////////////////

    /////// ADD ALL YOUR ROUTES HERE  /////////

    router.get('/users/:id?', [ middleware.exposeTemplates(), function (req, res) {
        var current;
        if (req.params.id) {
            req.session.contacts.forEach(function (contact) {
                if (contact.id == parseInt(req.params.id, 10)) {
                    current = contact;
                }
            });
        }
        console.log(current);
        res.render("users", {
            data: {
                contacts: req.session.contacts,
                current: current
            }
        });
    } ]);

    router.post('/api/add', function (req, res) {
        var user = new User({
            id: req.session.contactCount,
            name: req.body.name
        });

        req.session.contacts.push({
            id: user.getID(),
            name: user.getName()
        });
        req.session.contactCount++;

        if (!req.xhr) {
            res.redirect('/users');
        } else {
            res.statusCode = 201;
            res.json({
                id: user.getID(),
                name: user.getName()
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

